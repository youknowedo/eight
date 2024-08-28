import { eq } from "drizzle-orm";
import type { User } from "lucia";
import { isWithinExpirationDate } from "oslo";
import { z } from "zod";
import { lucia } from "../../lib/auth.js";
import { db } from "../../lib/db/index.js";
import { userTable, verificationCodesTable } from "../../lib/db/schema.js";
import { sendVerificationCode } from "../../lib/utils.js";
import { procedure, router } from "../../server.js";
import type { ResponseData } from "../../types.js";

export const codes = router({
    verify: procedure
        .input(z.string())
        .mutation(async ({ ctx, input: code }): Promise<ResponseData> => {
            if (!ctx.sessionId)
                return {
                    success: false,
                    error: "Unauthenticated",
                };

            const { session: oldSession, user } = await lucia.validateSession(
                ctx.sessionId
            );
            if (!oldSession)
                return {
                    success: false,
                    error: "Unauthenticated",
                };

            await lucia.invalidateUserSessions(user.id);
            await db
                .update(userTable)
                .set({
                    email_verified: true,
                })
                .where(eq(userTable.id, user.id));

            const databaseCode = (
                await db
                    .select({
                        code: verificationCodesTable.code,
                        expiresAt: verificationCodesTable.expiresAt,
                    })
                    .from(verificationCodesTable)
                    .where(eq(verificationCodesTable.userId, user.id))
            )[0];

            if (
                !databaseCode ||
                databaseCode.code !== code ||
                !isWithinExpirationDate(databaseCode.expiresAt)
            )
                return {
                    success: false,
                    error: "Invalid code",
                };

            await db
                .delete(verificationCodesTable)
                .where(eq(verificationCodesTable.userId, user.id));

            const session = await lucia.createSession(user.id, {});
            const sessionCookie = lucia.createSessionCookie(session.id);

            ctx.res.setHeader("Set-Cookie", sessionCookie.serialize());
            return {
                success: true,
            };
        }),
    resend: procedure.mutation(
        async ({ ctx, input }): Promise<ResponseData> => {
            if (!ctx.sessionId)
                return {
                    success: false,
                    error: "Unauthenticated",
                };

            const { session, user } = await lucia.validateSession(
                ctx.sessionId
            );
            if (!session)
                return {
                    success: false,
                    error: "Unauthenticated",
                };

            await sendVerificationCode(user.id);

            return {
                success: true,
            };
        }
    ),
});
