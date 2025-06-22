import express from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import uploadRoute from "./upload.route";
import categoryRoutes from "./category.route";
import productRoutes from "./product.route";
import orderRoutes from "./order.route";
import paymentRoutes from "./payment.route";
import transactionRoutes from "./transaction.route";
const app = express();

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/upload", uploadRoute);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/payment", paymentRoutes);
app.use("/transactions", transactionRoutes);


export default app;