export type User = {
    id: string;
    email: string;
    email_verified: boolean;
    username: string;
    completed_profile: boolean;
    full_name: string | null;
    role: "admin" | "user";
    pfp: string | null;
};
