import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
    type Express,
    type NextFunction,
    type Request,
    type Response,
} from "express";
import { auth } from "./procedures/auth/index.js";
import { session } from "./procedures/session/index.js";
import { user } from "./procedures/user/index.js";
import { createContext, router } from "./server.js";

export const appRouter = router({
    auth,
    user,
    session,
});

export type AppRouter = typeof appRouter;

const port = process.env.PORT || 3000;

export const app: Express = express();

app.use(express.json())
    .use(
        cors({
            origin(requestOrigin, callback) {
                const allowedOrigins = [
                    process.env.NODE_ENV === "production"
                        ? process.env.PROD_APP_URL
                        : "http://localhost:3001",
                    process.env.NODE_ENV === "production"
                        ? process.env.PROD_WEB_URL
                        : "http://localhost:3002",
                ];

                if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
                    callback(null, true);
                } else {
                    callback(null, false);
                }
            },
            credentials: true,
        })
    )
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser())
    .use(
        "/trpc",
        createExpressMiddleware({
            router: appRouter,
            createContext,
        })
    );

app.get(
    "/",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200).json({
                message: "Hurray!! we create our first server on bun js",
                success: true,
            });
        } catch (error: unknown) {
            next(new Error((error as Error).message));
        }
    }
);

app.listen(port, () => {
    console.log(`Server is up and running on port http://localhost:${port}`);
});

export default app;
