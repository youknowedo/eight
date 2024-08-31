import { eq, or } from "drizzle-orm";
import { z } from "zod";
import { lucia } from "../../lib/auth";
import { db } from "../../lib/db";
import { friendsTable, locationsTable } from "../../lib/db/schema";
import { procedure } from "../../server";
import type { ResponseData } from "../../types";

export const mutations = {
    update: procedure
        .input(
            z.object({
                latitude: z.number(),
                longitude: z.number(),
            })
        )
        .query(async ({ ctx, input }): Promise<ResponseData> => {
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

            const userLocation = (
                await db
                    .select()
                    .from(locationsTable)
                    .where(eq(locationsTable.id, user.id))
            )[0];

            if (userLocation)
                await db
                    .update(locationsTable)
                    .set({
                        latitude: input.latitude,
                        longitude: input.longitude,
                        timestamp: new Date(),
                    })
                    .where(eq(locationsTable.id, user.id));
            else
                await db.insert(locationsTable).values({
                    id: user.id,
                    latitude: input.latitude,
                    longitude: input.longitude,
                    timestamp: new Date(),
                });

            return {
                success: true,
            };
        }),
};
