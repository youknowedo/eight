import { parse } from "expo-linking";
import { setItemAsync } from "expo-secure-store";
import { openAuthSessionAsync } from "expo-web-browser";
import { Button, Text, View } from "react-native";

type User = {
    id: string;
    username: string;
    email: string;
    password_hash: string;
    github_id: string;
};

const Index = () => {
    return (
        <View>
            <Button onPress={() => login()} title="Login" />
        </View>
    );
};

export default Index;

const login = async (): Promise<User | void> => {
    console.log("result");
    const result = await openAuthSessionAsync(
        "http://localhost:3000/api/auth/github",
        "exp://192.168.2.100:8081/login"
    );
    console.log(result);
    if (result.type !== "success") return;
    const url = parse(result.url);
    const sessionToken = url.queryParams?.session_token?.toString() ?? null;
    if (!sessionToken) return;
    const user = await getUser(sessionToken);
    await setItemAsync("session_token", sessionToken);
};

const getUser = async (sessionToken: string): Promise<User> => {
    const res = await fetch("http://localhost:3000/api/user", {
        headers: { Authorization: `Bearer ${sessionToken}` },
    });
    if (!res.ok) throw new Error("Unauthorized");
    const { user } = await res.json();

    return user;
};
