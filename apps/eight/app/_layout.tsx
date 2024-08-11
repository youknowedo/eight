import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { parse } from "expo-linking";
import { Stack } from "expo-router";
import { setItemAsync } from "expo-secure-store";
import { openAuthSessionAsync } from "expo-web-browser";
import React from "react";
import { gql } from "shared/src/generated/client";

const client = new ApolloClient({
    uri: "http://localhost:4000/graphql",
    cache: new InMemoryCache(),
});

export default function AppLayout() {
    const signIn = async (): Promise<User | null> => {
        const result = await openAuthSessionAsync(
            "http://localhost:3000/login/github",
            "exp://192.168.2.100:8081/login"
        );
        if (result.type !== "success") return;
        const url = parse(result.url);
        const sessionToken = url.queryParams?.session_token?.toString() ?? null;
        if (!sessionToken) return;
        const user = await getUser(sessionToken);
        await setItemAsync("session_token", sessionToken);
        // ...
    };

    return (
        <ApolloProvider client={client}>
            <Stack />
        </ApolloProvider>
    );
}

const getUser = async (sessionToken: string): Promise<User | null> => {
    client.query({
        query: gql``,
    });
    const response = await fetch("http://localhost:3000/user", {
        headers: {
            Authorization: `Bearer ${sessionToken}`,
        },
    });
    if (!response.ok) return null;
    return await response.json();
};
