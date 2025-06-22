import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "../../config/db";
import routes from "../../routes";
import errorHandler from "../../middlewares/errorHandler";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", routes);

app.use(errorHandler);
export default app;