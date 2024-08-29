import { and, eq, or } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";
import { z } from "zod";
import { lucia } from "../../lib/auth.js";
import { db } from "../../lib/db/index.js";
import {
    friendRequestsTable,
    friendsTable,
    userTable,
} from "../../lib/db/schema.js";
import { procedure, router } from "../../server.js";
import type { ResponseData } from "../../types.js";

export const mutations = {
    request: procedure
        .input(z.string())
        .mutation(
            async ({
                ctx,
                input: id,
            }): Promise<ResponseData<{ success: boolean }>> => {
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

                const friends = await db
                    .select({
                        id: friendsTable.id,
                    })
                    .from(friendsTable)
                    .where(
                        or(
                            and(
                                eq(friendsTable.user1, user.id),
                                eq(friendsTable.user2, id)
                            ),
                            and(
                                eq(friendsTable.user1, id),
                                eq(friendsTable.user2, user.id)
                            )
                        )
                    );

                if (friends.length > 0)
                    return {
                        success: false,
                        error: "Already friends",
                    };

                const requests = await db
                    .select({
                        id: friendRequestsTable.id,
                    })
                    .from(friendRequestsTable)
                    .where(
                        or(
                            and(
                                eq(friendRequestsTable.from, user.id),
                                eq(friendRequestsTable.to, id)
                            ),
                            and(
                                eq(friendRequestsTable.from, id),
                                eq(friendRequestsTable.to, user.id)
                            )
                        )
                    );

                if (requests.length > 0)
                    return {
                        success: false,
                        error: "Friend request already sent",
                    };

                await db.insert(friendRequestsTable).values({
                    id: generateIdFromEntropySize(10),
                    from: user.id,
                    to: id,
                });

                return {
                    success: true,
                };
            }
        ),
    accept: procedure
        .input(z.string())
        .mutation(
            async ({
                ctx,
                input: id,
            }): Promise<ResponseData<{ success: boolean }>> => {
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

                const request = (
                    await db
                        .select({
                            id: friendRequestsTable.id,
                        })
                        .from(friendRequestsTable)
                        .where(
                            and(
                                eq(friendRequestsTable.from, id),
                                eq(friendRequestsTable.to, user.id)
                            )
                        )
                )[0];

                if (!request)
                    return {
                        success: false,
                        error: "Friend request not found",
                    };

                await db.insert(friendsTable).values({
                    id: generateIdFromEntropySize(10),
                    user1: user.id,
                    user2: id,
                });

                await db
                    .delete(friendRequestsTable)
                    .where(eq(friendRequestsTable.id, request.id));

                return {
                    success: true,
                };
            }
        ),
};
