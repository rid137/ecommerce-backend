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
  "https://velora-e-commerce.pages.dev"
];

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));     // ✅ Same config for all requests
app.options('/*path', cors(corsOptions)); // ✅ Fixed wildcard

app.use(cookieParser());  // ✅ Moved before json/urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
// console.log("Swagger Specs Generated:", JSON.stringify(specs, null, 2)); 

app.use("/api", routes);
app.use(errorHandler);

export default app;