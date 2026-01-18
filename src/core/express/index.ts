import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "../../config/db";
import routes from "../../routes";
import errorHandler from "../../middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";
import { specs } from "../../docs/swagger";
import cors from "cors";

dotenv.config();

connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:6500",          
  "http://localhost:6501",         
  "https://your-frontend.render.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // This MUST be true for the jwt cookie to work
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
// console.log("Swagger Specs Generated:", JSON.stringify(specs, null, 2));

app.use("/api", routes);


app.use(errorHandler);
export default app;