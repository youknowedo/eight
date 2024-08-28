import { eq } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";
import * as nodemailer from "nodemailer";
import { TimeSpan, createDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";
import { db } from "./db/index.js";
import { userTable, verificationCodesTable } from "./db/schema.js";

export const createMailTransporter = () =>
    nodemailer.createTransport({
        host: process.env.MAIL_HOST ?? "",
        port: +(process.env.MAIL_PORT ?? 587),
        secure: false,
        auth: {
            user: process.env.MAIL_USER ?? "",
            pass: process.env.MAIL_PASS ?? "",
        },
    });

export const sendVerificationCode = async (userId: string) => {
    const code = generateRandomString(8, alphabet("0-9"));

    await db
        .delete(verificationCodesTable)
        .where(eq(verificationCodesTable.userId, userId));

    const id = generateIdFromEntropySize(10);
    await db.insert(verificationCodesTable).values({
        id,
        userId,
        code,
        expiresAt: createDate(new TimeSpan(15, "m")),
    });

    const { email } = (
        await db
            .select({
                email: userTable.email,
            })
            .from(userTable)
            .where(eq(userTable.id, userId))
    )[0];

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST ?? "",
            port: +(process.env.MAIL_PORT ?? 587),
            secure: false,
            auth: {
                user: process.env.MAIL_USER ?? "",
                pass: process.env.MAIL_PASS ?? "",
            },
        });
        await transporter.verify().catch((err) => {
            console.error("error");
            console.error(err);
        });
        console.log("Transporter ready");

        const info = transporter.sendMail(
            {
                from: '"Eight" <no-reply@kader.se>',
                to: email,
                subject: "Your verification code has arrived!",
                html: `Your verification code is: <b>${code}</b>`,
            },
            (err, info) => {
                if (err) {
                    console.error("error");
                    console.error(err);
                }
                console.log(info);
                console.log(`Message sent: ${info.messageId}`);
            }
        );

        return info;
    } catch (err) {
        console.error("error");
        console.error(err);
        return err;
    }
};
