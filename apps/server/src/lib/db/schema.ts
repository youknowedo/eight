import { relations } from "drizzle-orm";
import {
    boolean,
    numeric,
    pgEnum,
    pgTable,
    text,
    timestamp,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "user"]);
export const statusEnum = pgEnum("status", ["hanging", "down", "ghost"]);

export const userTable = pgTable("user", {
    id: text("id").primaryKey(),

    role: roleEnum("role").notNull().default("user"),
    status: statusEnum("status").notNull().default("ghost"),

    completed_profile: boolean("completed_profile").notNull().default(false),
    full_name: text("full_name"),

    username: text("username").unique().notNull(),
    email: text("email").unique().notNull(),
    email_verified: boolean("email_verified").notNull().default(false),
    password_hash: text("password_hash"),
});

export const sessionTable = pgTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});

export const verificationCodesTable = pgTable("verification_codes", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    code: text("code").notNull(),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});

export const resetPasswordTable = pgTable("reset_password", {
    tokenHash: text("token_hash").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});

export const friendsTable = pgTable("friends", {
    id: text("id").primaryKey(),
    user1: text("user_1")
        .notNull()
        .references(() => userTable.id),
    user2: text("user_2")
        .notNull()
        .references(() => userTable.id),
});

export const friendRequestsTable = pgTable("friend_requests", {
    id: text("id").primaryKey(),
    from: text("from")
        .notNull()
        .references(() => userTable.id),
    to: text("to")
        .notNull()
        .references(() => userTable.id),
});

export const locationsTable = pgTable("locations", {
    id: text("id")
        .primaryKey()
        .references(() => userTable.id),
    latitude: numeric("latitude").$type<number>().notNull(),
    longitude: numeric("longitude").$type<number>().notNull(),
    timestamp: timestamp("timestamp", {
        withTimezone: true,
    }).notNull(),
});
