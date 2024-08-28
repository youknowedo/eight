import { hash } from "argon2";
import { eq } from "drizzle-orm";
import { generateIdFromEntropySize, TimeSpan } from "lucia";
import { createDate, isWithinExpirationDate } from "oslo";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import { z } from "zod";
import { lucia } from "../../lib/auth.js";
import { db } from "../../lib/db/index.js";
import { resetPasswordTable, userTable } from "../../lib/db/schema.js";
import { createMailTransporter } from "../../lib/utils.js";
import { procedure, router } from "../../server.js";
import type { ResponseData } from "../../types.js";

export const reset = router({
    send: procedure
        .input(z.string().email())
        .mutation(async ({ ctx, input: email }): Promise<ResponseData> => {
            const user = (
                await db
                    .select({ id: userTable.id })
                    .from(userTable)
                    .where(eq(userTable.email, email))
                    .limit(1)
            )[0];
            if (!user)
                return {
                    success: false,
                    error: "No user with that email",
                };

            await db
                .delete(resetPasswordTable)
                .where(eq(resetPasswordTable.userId, user.id));

            const tokenId = generateIdFromEntropySize(25); // 40 character
            const tokenHash = encodeHex(
                await sha256(new TextEncoder().encode(tokenId))
            );
            await db.insert(resetPasswordTable).values({
                tokenHash: tokenHash,
                userId: user.id,
                expiresAt: createDate(new TimeSpan(2, "h")),
            });

            const transporter = createMailTransporter();
            const link = `${ctx.req.headers.origin}/reset/callback?token=${tokenId}`;

            const info = transporter.sendMail(
                {
                    from: '"Eight" <no-reply@kader.se>',
                    to: email,
                    subject: "Your reset link has arrived!",
                    html: `Click on the link below to reset your password: \n <a href="${link}">${link}</a>`,
                },
                (err, info) => {
                    if (err) {
                        console.error("error");
                        console.error(err);
                    }
                    console.log(info);
                    console.log(`Message sent: ${info.messageId}`);
                }
            );
            console.log(info);

            return {
                success: true,
            };
        }),
    withToken: procedure
        .input(
            z.object({
                verificationToken: z.string(),
                password: z.string().min(6),
            })
        )
        .mutation(async ({ ctx, input }): Promise<ResponseData> => {
            const { verificationToken, password } = input;

            const tokenHash = encodeHex(
                await sha256(new TextEncoder().encode(verificationToken))
            );
            const token = (
                await db
                    .select()
                    .from(resetPasswordTable)
                    .where(eq(resetPasswordTable.tokenHash, tokenHash))
                    .limit(1)
            )[0];
            if (token)
                await db
                    .delete(resetPasswordTable)
                    .where(eq(resetPasswordTable.tokenHash, tokenHash));

            if (!token || !isWithinExpirationDate(token.expiresAt)) {
                return {
                    success: false,
                    error: "Invalid or expired token",
                };
            }

            await lucia.invalidateUserSessions(token.userId);
            const passwordHash = await hash(password, {
                // recommended minimum parameters
                memoryCost: 19456,
                timeCost: 2,
                hashLength: 32,
                parallelism: 1,
            });
            await db
                .update(userTable)
                .set({
                    password_hash: passwordHash,
                })
                .where(eq(userTable.id, token.userId));

            const session = await lucia.createSession(token.userId, {});
            const sessionCookie = lucia.createSessionCookie(session.id);

            ctx.res.setHeader("Set-Cookie", sessionCookie.serialize());
            ctx.res.setHeader("Referrer-Policy", "strict-origin");

            return {
                success: true,
            };
        }),
});
