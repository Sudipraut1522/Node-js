import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./routes/user.route.js";
import { adminRouter } from "./routes/admin.router.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1", router);

app.use("/api/v1", adminRouter);

export { app };
