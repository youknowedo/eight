import { githubAuth, lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { userTable } from "@/lib/schema/user";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";
import { NextApiHandler } from "next";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET: NextApiHandler = async (req, res) => {
    const url = new URL(req.url ?? "");

    const code = url.searchParams.get("code");
    if (!code)
        return NextResponse.json(null, {
            status: 400,
        });

    const state = url.searchParams.get("state");
    const storedState = cookies().get("github_oauth_state")?.value;
    if (!state || !storedState || state !== storedState) {
        return NextResponse.json(null, {
            status: 400,
        });
    }

    try {
        const tokens = await githubAuth.validateAuthorizationCode(code);
        const githubUserResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
            },
        });
        const githubUser: GitHubUser = await githubUserResponse.json();

        // Replace this with your own DB client.
        const existingUser = (
            await db
                .select({ id: userTable.id, github_id: userTable.github_id })
                .from(userTable)
                .where(eq(userTable.github_id, githubUser.id))
        )[0];

        if (existingUser) {
            const session = await lucia.createSession(existingUser.id, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            );
            return new Response(null, {
                status: 302,
                headers: {
                    Location: "/",
                },
            });
        }

        const userId = generateIdFromEntropySize(10); // 16 characters long

        // Replace this with your own DB client.
        await db.insert(userTable).values({
            id: userId,
            email: githubUser.email,
            github_id: githubUser.id,
            username: githubUser.login,
        });

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/",
            },
        });
    } catch (e) {
        // the specific error message depends on the provider
        if (e instanceof OAuth2RequestError) {
            // invalid code
            return new Response(null, {
                status: 400,
            });
        }
        return new Response(null, {
            status: 500,
        });
    }
};

type GitHubUser = {
    id: string;
    email: string;
    login: string;
};
