import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { parse } from "expo-linking";
import { Stack } from "expo-router";
import { setItemAsync } from "expo-secure-store";
import { openAuthSessionAsync } from "expo-web-browser";
import React from "react";

export default function AppLayout() {
    return <Stack />;
}
