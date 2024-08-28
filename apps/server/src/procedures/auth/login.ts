import { verify } from "argon2";
import { eq } from "drizzle-orm";
import type { User } from "lucia";
import { z } from "zod";
import { lucia } from "../../lib/auth.js";
import { db } from "../../lib/db/index.js";
import { userTable } from "../../lib/db/schema.js";
import { minio } from "../../lib/storage.js";
import { procedure } from "../../server.js";
import type { ResponseData } from "../../types.js";

export const login = procedure
    .input(
        z.object({
            email: z.string().email(),
            password: z.string().min(6),
        })
    )
    .mutation(async ({ ctx, input }): Promise<ResponseData<{ user: User }>> => {
        const { email, password } = input;

        const user = (
            await db
                .select()
                .from(userTable)
                .where(eq(userTable.email, email))
                .limit(1)
        )[0];

        if (!user) {
            // NOTE:
            // Returning immediately allows malicious actors to figure out valid emails from response times,
            // allowing them to only focus on guessing passwords in brute-force attacks.
            // As a preventive measure, you may want to hash passwords even for invalid emails.
            // However, valid emails can be already be revealed with the signup page
            // and a similar timing issue can likely be found in password reset implementation.
            // It will also be much more resource intensive.
            // Since protecting against this is non-trivial,
            // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
            // If emails/usernames are public, you may outright tell the user that the username is invalid.
            return {
                success: false,
                error: "Invalid email or password",
            };
        }

        const validPassword = await verify(user.password_hash!, password, {});
        if (!validPassword) {
            return {
                success: false,
                error: "Invalid email or password",
            };
        }

        const pfp = await minio.presignedGetObject(
            process.env.MINIO_BUCKET!,
            user.id + ".webp"
        );

        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        sessionCookie.attributes.sameSite = "lax";
        sessionCookie.attributes.secure = process.env.NODE_ENV === "production";
        if (process.env.NODE_ENV === "production")
            sessionCookie.attributes.domain = ctx.req.headers.origin
                ?.replace(/^https?:\/\//, "")
                .replace(/^http?:\/\//, "");

        ctx.res.setHeader("Set-Cookie", sessionCookie.serialize());
        ctx.res.setHeader("Location", "/");

        return {
            success: true,
            user: {
                ...user,
                pfp,
            },
        };
    });
