import { eq } from "drizzle-orm";
import { z } from "zod";
import { lucia } from "../../lib/auth.js";
import { db } from "../../lib/db/index.js";
import { userTable } from "../../lib/db/schema.js";
import { minio } from "../../lib/storage.js";
import { procedure, router } from "../../server.js";
import type { ResponseData } from "../../types.js";

export const mutations = {
    updateProfile: procedure
        .input(
            z.object({
                full_name: z.string(),
            })
        )
        .mutation(
            async ({
                ctx,
                input,
            }): Promise<ResponseData<{ pfpUploadUrl: string }>> => {
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

                const { full_name: fullName } = input;

                await db
                    .update(userTable)
                    .set({
                        completed_profile: true,
                        full_name: fullName,
                    })
                    .where(eq(userTable.id, user.id));

                const pfpUploadUrl = await minio.presignedPutObject(
                    process.env.MINIO_BUCKET!,
                    user.id + ".webp",
                    3000
                );

                return {
                    success: true,
                    pfpUploadUrl,
                };
            }
        ),
};
