import { eq, or } from "drizzle-orm";
import { z } from "zod";
import { lucia } from "../../lib/auth";
import { db } from "../../lib/db";
import { friendsTable, locationsTable, userTable } from "../../lib/db/schema";
import { procedure } from "../../server";
import type { ResponseData } from "../../types";

export const mutations = {
    start: procedure
        .input(
            z.object({
                latitude: z.number(),
                longitude: z.number(),
            })
        )
        .mutation(
            async ({
                ctx,
                input: { latitude, longitude },
            }): Promise<ResponseData> => {
                const { session, user } = await lucia.validateSession(
                    ctx.sessionId ?? ""
                );
                if (!session)
                    return {
                        success: false,
                        error: "Unauthenticated",
                    };

                await db.insert(locationsTable).values({
                    id: user.id,
                    latitude,
                    longitude,
                    timestamp: new Date(),
                });
                await db.update(userTable).set({
                    status: "hanging",
                });

                return {
                    success: true,
                };
            }
        ),
    update: procedure
        .input(
            z.object({
                latitude: z.number(),
                longitude: z.number(),
            })
        )
        .mutation(async ({ ctx, input }): Promise<ResponseData> => {
            const { session, user } = await lucia.validateSession(
                ctx.sessionId ?? ""
            );
            if (!session)
                return {
                    success: false,
                    error: "Unauthenticated",
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
    stop: procedure.mutation(async ({ ctx }): Promise<ResponseData> => {
        const { session, user } = await lucia.validateSession(
            ctx.sessionId ?? ""
        );
        if (!session)
            return {
                success: false,
                error: "Unauthenticated",
            };

        await db.delete(locationsTable).where(eq(locationsTable.id, user.id));
        await db.update(userTable).set({
            status: "ghost",
        });

        return {
            success: true,
        };
    }),
};
