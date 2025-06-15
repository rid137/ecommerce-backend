import express from "express";
import authRoutes from "./authRoute";
import userRoutes from "./userRoute";
import uploadRoute from "./uploadRoute";
import categoryRoutes from "./categoryRoutes";
import productRoutes from "./productRoutes";
import orderRoutes from "./orderRoutes";
import paymentRoutes from "./paymentRoute";
import transactionRoutes from "./transactionRoute";
const app = express();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/transactions", transactionRoutes);


export default app;