import { lucia } from "@/lib/auth";
import { NextApiHandler } from "next";

export const GET: NextApiHandler = async (req, res) => {
    if (req.headers.authorization === undefined)
        return res.status(401).json({ message: "Unauthorized" });

    const sessionId = lucia.readBearerToken(req.headers.authorization);
    if (sessionId === null)
        return res.status(401).json({ message: "Unauthorized" });

    const user = (await lucia.validateSession(sessionId)).user;
    if (user === null) return res.status(401).json({ message: "Unauthorized" });

    return res.status(200).json({ user });
};
