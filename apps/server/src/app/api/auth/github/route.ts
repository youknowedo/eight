import { githubAuth } from "@/lib/auth";
import { generateState } from "arctic";
import { NextApiHandler } from "next";
import { redirect } from "next/dist/server/api-utils";
import { cookies } from "next/headers";

export const GET: NextApiHandler = async (req, res) => {
    const state = generateState();
    const url = await githubAuth.createAuthorizationURL(state, {
        scopes: ["user:email"],
    });

    cookies().set("github_oauth_state", state, {
        path: "/",
        maxAge: 60 * 10, // 10 min
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });

    redirect(res, url.toString());
};
