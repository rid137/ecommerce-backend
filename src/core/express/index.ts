import path from "path";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// // Utils
// import connectDB from "../../config/db";
import routes from "../../routes";
import errorHandler from "../../middlewares/errorHandler";

dotenv.config();
const port: string | number = process.env.PORT || 8080;

// connectDB();

const app = express();

// JSON parsing middleware
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", routes);

app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port: ${port}`));

export default app;