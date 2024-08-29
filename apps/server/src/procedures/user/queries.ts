import { eq, inArray, ne, or } from "drizzle-orm";
import type { User } from "lucia";
import { Secret, TOTP } from "otpauth";
import { z } from "zod";
import { lucia } from "../../lib/auth.js";
import { db } from "../../lib/db/index.js";
import { friendsTable, userTable } from "../../lib/db/schema.js";
import { minio } from "../../lib/storage.js";
import { procedure } from "../../server.js";
import type { ResponseData } from "../../types";

export const queries = {
    getSingle: procedure
        .input(z.string().nullish())
        .query(
            async ({
                ctx,
                input: id,
            }): Promise<{ success: boolean; error?: string; user?: User }> => {
                if (!ctx.sessionId)
                    return {
                        success: false,
                        error: "Unauthenticated 1",
                    };

                const { session, user } = await lucia.validateSession(
                    ctx.sessionId
                );
                if (!session)
                    return {
                        success: false,
                        error: "Unauthenticated 2",
                    };

                if (!id)
                    return {
                        success: true,
                        user: user && {
                            ...user,
                            pfp: await minio.presignedGetObject(
                                process.env.MINIO_BUCKET!,
                                user.id + ".webp"
                            ),
                        },
                    };

                if (user.role !== "admin")
                    return {
                        success: false,
                        error: "Unauthorized",
                    };

                const selectedUser = (
                    await db
                        .select()
                        .from(userTable)
                        .where(eq(userTable.id, id))
                )[0];

                return {
                    success: true,
                    user: selectedUser && {
                        ...selectedUser,
                        pfp: await minio.presignedGetObject(
                            process.env.MINIO_BUCKET!,
                            selectedUser.id + ".webp"
                        ),
                    },
                };
            }
        ),

    getMultiple: procedure
        .input(z.array(z.string()).nullish())
        .query(
            async ({
                ctx,
                input: ids,
            }): Promise<ResponseData<{ users: User[] }>> => {
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

                if (user.role !== "admin" && !ids)
                    return {
                        success: false,
                        error: "Unauthorized",
                    };

                const userSelect = db.select().from(userTable);
                const users = await (ids
                    ? userSelect.where(inArray(userTable.id, ids))
                    : userSelect);

                const pfp = await Promise.all(
                    users.map((u) =>
                        minio.presignedGetObject(
                            process.env.MINIO_BUCKET!,
                            u.id + ".webp"
                        )
                    )
                );

                return {
                    success: true,
                    users: users.map((u, i) => u && { ...u, pfp: pfp[i] }),
                };
            }
        ),
    getFriends: procedure
        .input(z.string().nullish())
        .query(
            async ({
                ctx,
                input: id,
            }): Promise<ResponseData<{ friends: string[] }>> => {
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
};
