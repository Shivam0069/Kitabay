import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";
import authRouter from "./routes/authRouter.js";
import bookRouter from "./routes/bookRouter.js";
import borrowRouter from "./routes/borrowRouter.js";
import userRouter from "./routes/userRouter.js";
import expressFileUpload from "express-fileupload";
import { notifyUsers } from "./services/notifyUsers.js";
import { removeUnverifiedAccount } from "./services/removeUnverifiedAccount.js";

dotenv.config({ path: "./config/config.env" });

export const app = express();

app.use(
  cors({
    origin: ["https://kitabay-bookworm.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressFileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);

notifyUsers();
removeUnverifiedAccount();
await connectDB();

app.use(errorMiddleware);
