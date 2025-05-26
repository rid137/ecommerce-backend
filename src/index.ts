import path from "path";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// // Utils
import connectDB from "./config/db";
import userRoutes from "./routes/userRoute";
import authRoutes from "./routes/authRoute";
import categoryRoutes from "./routes/categoryRoutes";
import uploadRoute from "./routes/uploadRoute";
import productRoutes from "./routes/productRoutes";
// import uploadRoutes from "./routes/uploadRoutes";
import orderRoutes from "./routes/orderRoutes";
import paymentRoute from "./routes/paymentRoute";
import transactionRoute from "./routes/transactionRoute";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();
const port: string | number = process.env.PORT || 8080;

connectDB();

const app = express();

// JSON parsing middleware
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoute);
app.use("/api/transactions", transactionRoute);

app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port: ${port}`));