import { db } from "@/lib/db";
import { locationTable, userTable } from "@/lib/schema/user";
import { eq } from "drizzle-orm";
import { GraphQLError } from "graphql";
import { Location } from "shared/graphql";
import { ModelContext } from ".";

export const user = (context: ModelContext) => ({
    get: async (id: string) => {
        const u = await db
            .select()
            .from(userTable)
            .where(eq(userTable.id, id))
            .limit(1)
            .then((u) => u[0]);

        if (!u)
            throw new GraphQLError("User not found", {
                extensions: {
                    code: "NOT_FOUND",
                },
            });

        return u;
    },
    current: async () => {
        if (!context.userId)
            throw new GraphQLError("Unauthorized", {
                extensions: {
                    code: "UNAUTHORIZED",
                },
            });

        const u = db
            .select()
            .from(userTable)
            .where(eq(userTable.id, context.userId))
            .limit(1)
            .then((u) => u[0]);

        if (!u)
            throw new GraphQLError("User not found", {
                extensions: {
                    code: "NOT_FOUND",
                },
            });

        return u;
    },

    // MAYBE TODO: Move inside of user model
    setLocationToCoords: async (
        longitude: number,
        latitude: number
    ): Promise<Location> => {
        if (!context.userId)
            throw new GraphQLError("Unauthorized", {
                extensions: {
                    code: "UNAUTHORIZED",
                },
            });

        const coords = {
            longitude,
            latitude,
        };
        const timestamp = new Date().toISOString();

        await db
            .update(locationTable)
            .set({
                longitude: coords.longitude,
                latitude: coords.latitude,
                with: null,
                timestamp: timestamp,
            })
            .where(eq(locationTable.userId, context.userId));

        return {
            coords,
            timestamp,
        };
    },
    setLocationToUser: async (id: string): Promise<Location> => {
        if (!context.userId)
            throw new GraphQLError("Unauthorized", {
                extensions: {
                    code: "UNAUTHORIZED",
                },
            });

        const timestamp = new Date().toISOString();

        await db
            .update(locationTable)
            .set({
                with: id,
                latitude: null,
                longitude: null,
                timestamp: timestamp,
            })
            .where(eq(locationTable.userId, context.userId));

        return { with: id, timestamp };
    },
});
