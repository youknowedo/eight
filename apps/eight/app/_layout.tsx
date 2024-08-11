import { Redirect, Stack } from "expo-router";
import { Text } from "react-native";

export default function AppLayout() {
    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (!session) {
        return <Redirect href="/login" />;
    }

    return <Stack />;
}
