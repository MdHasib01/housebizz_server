import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/healthcheck", (req, res) =>
  res.status(200).json({ status: "OK" })
);

export default app;
