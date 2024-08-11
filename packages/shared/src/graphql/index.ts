import { DocumentNode } from "graphql";
import { authDefs } from "./user";
// export * from "../generated/graphql";
export * from "../generated/client";

export const typeDefs: DocumentNode[] = [authDefs];

export type Context<T = any> = {
    bearerToken?: string;
    userId?: string;
    sessionId?: string;
    models: T;
};
