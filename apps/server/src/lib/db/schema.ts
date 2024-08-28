import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "user"]);

export const userTable = pgTable("user", {
    id: text("id").primaryKey(),

    role: roleEnum("role").notNull().default("user"),

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
