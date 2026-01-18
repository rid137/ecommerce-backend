import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "../../config/db";
import routes from "../../routes";
import errorHandler from "../../middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";
import { specs } from "../../docs/swagger";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
// console.log("Swagger Specs Generated:", JSON.stringify(specs, null, 2));

app.use("/api", routes);


app.use(errorHandler);
export default app;