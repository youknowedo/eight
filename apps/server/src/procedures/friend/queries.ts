import { eq, inArray, ne, or } from "drizzle-orm";
import type { User } from "lucia";
import { Secret, TOTP } from "otpauth";
import { z } from "zod";
import { lucia } from "../../lib/auth.js";
import { db } from "../../lib/db/index.js";
import {
    friendRequestsTable,
    friendsTable,
    userTable,
} from "../../lib/db/schema.js";
import { minio } from "../../lib/storage.js";
import { procedure } from "../../server.js";
import type { ResponseData } from "../../types";

export const queries = {
    getAll: procedure
        .input(z.string().nullish())
        .query(
            async ({
                ctx,
                input: id,
            }): Promise<ResponseData<{ friends: string[] }>> => {
                const { session, user } = await lucia.validateSession(
                    ctx.sessionId ?? ""
                );
                if (!session)
                    return {
                        success: false,
                        error: "Unauthenticated",
                    };

                if (user.role !== "admin" && id)
                    return {
                        success: false,
                        error:
                            "Unauthorized. Role " + user.role + ". Id: " + id,
                    };

                if (!id) id = user.id;

                const friends = await db
                    .select()
                    .from(friendsTable)
                    .where(
                        or(
                            eq(friendsTable.user1, id),
                            eq(friendsTable.user2, id)
                        )
                    );

                const friendIds = friends.map((f) =>
                    f.user1 === id ? f.user2 : f.user1
                );

                return {
                    success: true,
                    friends: friendIds,
                };
            }
        ),
    requests: procedure
        .input(z.string().nullish())
        .query(
            async ({
                ctx,
                input: id,
            }): Promise<ResponseData<{ requests: string[] }>> => {
                const { session, user } = await lucia.validateSession(
                    ctx.sessionId ?? ""
                );
                if (!session)
                    return {
                        success: false,
                        error: "Unauthenticated",
                    };

                if (user.role !== "admin" && id)
                    return {
                        success: false,
                        error:
                            "Unauthorized. Role " + user.role + ". Id: " + id,
                    };

                if (!id) id = user.id;

                const requests = await db
                    .select()
                    .from(friendRequestsTable)
                    .where(eq(friendRequestsTable.to, id));

                return {
                    success: true,
                    requests: requests.map((r) => r.from),
                };
            }
        ),
};
