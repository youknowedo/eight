import { SessionProvider } from "@/auth/context";
import { Slot, Stack } from "expo-router";

export default function RootLayout() {
    return (
        <SessionProvider>
            <Slot />
        </SessionProvider>
    );
}
