import { and, eq, or } from "drizzle-orm";
import { z } from "zod";
import { lucia } from "../../lib/auth";
import { db } from "../../lib/db";
import { friendsTable, locationsTable } from "../../lib/db/schema";
import { procedure } from "../../server";

export const queries = {
    user: procedure.input(z.string()).query(async ({ ctx, input: userId }) => {
        if (!ctx.sessionId)
            return {
                success: false,
                error: "Unauthenticated 1",
            };

        const { session, user } = await lucia.validateSession(ctx.sessionId);
        if (!session)
            return {
                success: false,
                error: "Unauthenticated 2",
            };

        const friends = await db
            .select()
            .from(friendsTable)
            .where(
                or(
                    and(
                        eq(friendsTable.user1, user.id),
                        eq(friendsTable.user2, userId)
                    ),
                    and(
                        eq(friendsTable.user1, userId),
                        eq(friendsTable.user2, user.id)
                    )
                )
            );

        if (friends.length === 0)
            return {
                success: false,
                error: "Not friends",
            };

        // get user location
        const userLocation = (
            await db
                .select()
                .from(locationsTable)
                .where(eq(locationsTable.id, userId))
        )[0];

        return {
            success: true,
            location: userLocation,
        };
    }),
};
