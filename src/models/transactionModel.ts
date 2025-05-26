import mongoose from "mongoose";

export interface TransactionDoc extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  reference: string; // same as orderId
  amount: number;
  status: string; // 'pending', 'success', 'failed'
  currency: string;
  email: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new mongoose.Schema<TransactionDoc>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Order",
      unique: true, // Enforce 1-to-1 with order
    },
    reference: { type: String, required: true, unique: true }, // orderId
    amount: { type: Number, required: true },
    status: { type: String, required: true, default: "pending" },
    currency: { type: String, default: "NGN" },
    email: { type: String, required: true },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

const Transaction = mongoose.model<TransactionDoc>("Transaction", transactionSchema);
export default Transaction;