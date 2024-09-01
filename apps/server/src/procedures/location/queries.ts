import { and, eq, inArray, or } from "drizzle-orm";
import { z } from "zod";
import { lucia } from "../../lib/auth";
import { db } from "../../lib/db";
import { friendsTable, locationsTable, userTable } from "../../lib/db/schema";
import { procedure } from "../../server";
import type { ResponseData } from "../../types";

type Location = {
    id: string;
    latitude: number;
    longitude: number;
    timestamp: Date;
};

export const queries = {
    single: procedure.input(z.string().nullish()).query(
        async ({
            ctx,
            input: userId,
        }): Promise<
            ResponseData<{
                location: Location;
            }>
        > => {
            const { session, user } = await lucia.validateSession(
                ctx.sessionId ?? ""
            );
            if (!session)
                return {
                    success: false,
                    error: "Unauthenticated",
                };

            const userLocations = await db
                .select()
                .from(locationsTable)
                .where(eq(locationsTable.id, userId ?? user.id));

            if (
                userLocations[0].timestamp >
                new Date(Date.now() + 1000 * 60 * 60)
            ) {
                await db
                    .delete(locationsTable)
                    .where(eq(locationsTable.id, userId ?? user.id));
                await db.update(userTable).set({
                    status: "ghost",
                });

                return {
                    success: true,
                };
            }

            return {
                success: true,
                location: userLocations[0],
            };
        }
    ),
    friends: procedure.query(
        async ({
            ctx,
        }): Promise<
            ResponseData<{
                locations: Location[];
            }>
        > => {
            const { session, user } = await lucia.validateSession(
                ctx.sessionId ?? ""
            );
            if (!session)
                return {
                    success: false,
                    error: "Unauthenticated",
                };

            const friends = await db
                .select({ id: friendsTable.id })
                .from(friendsTable)
                .where(
                    or(
                        eq(friendsTable.user1, user.id),
                        eq(friendsTable.user2, user.id)
                    )
                );

            const friendLocations = (
                await db
                    .select()
                    .from(locationsTable)
                    .where(
                        inArray(
                            locationsTable.id,
                            friends.map((f) => f.id)
                        )
                    )
            )
                .map((location) => {
                    if (
                        location.timestamp <
                        new Date(Date.now() + 1000 * 60 * 60)
                    )
                        return location;

                    db.delete(locationsTable).where(
                        eq(locationsTable.id, location.id)
                    );
                    db.update(userTable)
                        .set({
                            status: "ghost",
                        })
                        .where(eq(userTable.id, location.id));

                    return null;
                })
                .filter((l) => l !== null);

            return {
                success: true,
                locations: friendLocations,
            };
        }
    ),
};
