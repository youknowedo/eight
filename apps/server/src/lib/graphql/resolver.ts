import { Context, Resolvers } from "shared/graphql";
import { Models } from "./models";

export const resolvers: Resolvers<Context<Models>> = {
    Query: {
        currentUser: async (_, __, context) => {
            const user = await context.models.user.current();
            return { ...user, password_hash: user.passwordHash };
        },
        user: async (_, { id }, context) => {
            const user = await context.models.user.get(id);

            return { ...user, password_hash: user.passwordHash };
        },
    },
    Mutation: {
        signup: async (_, { email, username, password }, context) => {
            return context.models.auth.signup(email, username, password);
        },
        login: async (_, { username, password }, context) => {
            return context.models.auth.login(username, password);
        },
        userLocationToCoords: async (_, { longitude, latitude }, context) => {
            return context.models.user.setLocationToCoords(longitude, latitude);
        },
        userLocationToUser: async (_, { id }, context) => {
            return context.models.user.setLocationToUser(id);
        },
    },
};
