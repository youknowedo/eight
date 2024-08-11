import { lucia } from "@/lib/auth";
import { models, Models } from "@/lib/graphql/models";
import { resolvers } from "@/lib/graphql/resolver";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import { Context, typeDefs } from "shared/graphql";

const server = new ApolloServer<Context<Models>>({
    typeDefs,
    resolvers: [],
});

const emptyContext: Context<Models> = {
    bearerToken: undefined,
    userId: undefined,
    sessionId: undefined,
    models: models({ userId: undefined, sessionId: undefined }),
};

const handler = startServerAndCreateNextHandler<NextRequest, Context<Models>>(
    server,
    {
        context: async (req): Promise<Context<Models>> => {
            const bearerToken = req.headers.get("Authorization") ?? undefined;
            if (!bearerToken) return emptyContext;

            const sessionId = lucia.readBearerToken(bearerToken);
            if (!sessionId) return emptyContext;

            let userId: string | undefined = undefined;
            if (sessionId) {
                const user = await lucia
                    .validateSession(sessionId)
                    .then((su) => su.user);

                userId = user?.id;
            }

            return {
                userId,
                sessionId,
                models: models({ userId, sessionId }),
            };
        },
    }
);

export { handler as GET, handler as POST };
