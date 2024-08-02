import {
    doublePrecision,
    pgSchema,
    text,
    timestamp,
} from "drizzle-orm/pg-core";

const schema = pgSchema("eight");

export const userTable = schema.table("user", {
    id: text("id").primaryKey(),
    username: text("username").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
});

export const locationTable = schema.table("location", {
    userId: text("user_id")
        .primaryKey()
        .references(() => userTable.id),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    with: text("with"),
    timestamp: timestamp("timestamp", {
        withTimezone: true,
        mode: "string",
    }).notNull(),
});

export const sessionTable = schema.table("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});
