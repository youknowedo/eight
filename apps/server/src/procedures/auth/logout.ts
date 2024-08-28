import { lucia } from "../../lib/auth.js";
import { procedure } from "../../server.js";
import type { ResponseData } from "../../types.js";

export const logout = procedure.mutation(
    async ({ ctx, input }): Promise<ResponseData> => {
        if (!ctx.sessionId)
            return {
                success: false,
                error: "Not logged in",
            };

        await lucia.invalidateSession(ctx.sessionId);

        const sessionCookie = lucia.createBlankSessionCookie();
        sessionCookie.attributes.sameSite = "lax";
        sessionCookie.attributes.secure = process.env.NODE_ENV === "production";
        if (process.env.NODE_ENV === "production")
            sessionCookie.attributes.domain = ctx.req.headers.origin
                ?.replace(/^https?:\/\//, "")
                .replace(/^http?:\/\//, "");

        ctx.res.setHeader("Set-Cookie", sessionCookie.serialize());
        ctx.res.setHeader("Location", "/login");

        return {
            success: true,
        };
    }
);
