import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/lib/schema/*",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        database: "",
        host: "hackclub.app",
        port: 5432,
        user: "",
        password: "",
    },
});
