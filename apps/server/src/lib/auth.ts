import { Lucia } from "lucia";
import { adapter } from "./db/index.js";

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: process.env.NODE_ENV === "PRODUCTION", // set `Secure` flag in HTTPS
        },
    },
    getUserAttributes: (attributes) => {
        return {
            email: attributes.email,
            email_verified: attributes.email_verified,
            username: attributes.username,
            completed_profile: attributes.completed_profile,
            full_name: attributes.full_name,
            role: attributes.role,
            pfp: null as string | null,
            status: attributes.status,
        };
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: {
            email: string;
            email_verified: boolean;
            username: string;
            completed_profile: boolean;
            full_name: string | null;
            role: "admin" | "user";
            pfp: string | null;
            status: "hanging" | "down" | "ghost";
        };
    }
}
