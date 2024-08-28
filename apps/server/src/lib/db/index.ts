import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { sessionTable, userTable } from "./schema.js";

const client = new pg.Client({
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});
client.connect();

export const db = drizzle(client);

export const adapter = new DrizzlePostgreSQLAdapter(
    db,
    sessionTable,
    userTable
);
