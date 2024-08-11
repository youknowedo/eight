import { Context, Resolvers } from "shared/graphql";
import { lucia } from "../auth";
import { Models } from "./models";

export const resolvers: Resolvers<Context<Models>> = {
    Query: {
        currentUser: async (_, __, context) => {
            return context.models.user.current();
        },
        user: async (_, args, context) => {
            const { id } = args;

            return context.models.user.get(id);
        },
    },
    Mutation: {
        signup: async (_, args, context) => {
            const { email, username, password } = args;

            return context.models.auth.signup(email, username, password);
        },
        login: async (_, args, context) => {
            const { username, password } = args;

            return context.models.auth.login(username, password);
        },
        userLocation: async (_, args, context) => {
            const { longitude, latitude } = args;

            return context.models.user.setLocation(longitude, latitude);
        },
    },
};
