import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ErrorMiddleware } from "./middlewares/error.middleware.js";

export const app = express();

app.use(express.json({ limit: "16kb", strict: true }));
app.use(express.static("public"));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

import userRoutes from "./routes/user.routes.js";
import managementRoutes from "./routes/userManagement.routes.js"

app.use("/api", userRoutes);
app.use("/api", managementRoutes);

app.use(ErrorMiddleware);
