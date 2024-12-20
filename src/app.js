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
app.use(express.static("public"));
app.use(cookieParser());

// import routes
import userRouter from "./routes/usr.routes.js";
import propertyRouter from "./routes/property.routes.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";

// routes
app.use("/api/v1/healthcheck", (req, res) =>
  res.status(200).json({ status: "OK" })
);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/properties", propertyRouter);

app.use(errorHandler);
export default app;
