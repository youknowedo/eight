import { Redirect, Stack } from "expo-router";
import { Text } from "react-native";

import { useSession } from "@/auth/context";

export default function AppLayout() {
    const { session, isLoading } = useSession();

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (!session) {
        return <Redirect href="/login" />;
    }

    return <Stack />;
}
