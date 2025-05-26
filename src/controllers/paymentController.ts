import axios from "axios";
import Order from "../models/orderModel";
import Transaction from "../models/transactionModel";
import asyncHandler from "../middlewares/asyncHandler";
import { BadRequest, NotFound } from "../errors/httpErrors";
import { successResponse } from "../utils/apiResponse";

interface PaystackResponse {
  data: {
    authorization_url: string;
    reference: string;
    status: string;
    paid_at?: string;
    customer?: {
      email: string;
    };
    id?: string;
  };
}

const initializePayment = asyncHandler(async (req, res) => {
  const { orderId, email } = req.body;

  if (!orderId?.trim()) {
    throw BadRequest("Order ID is required");
  }

  if (!email?.trim()) {
    throw BadRequest("Email is required");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw NotFound("Order not found");
  }

  const reference = orderId; // Reuse orderId as Paystack reference

  // Create transaction if not exists
  const existingTx = await Transaction.findOne({ reference });
  if (!existingTx) {
    await Transaction.create({
      user: order.user,
      order: order._id,
      reference,
      amount: order.totalPrice,
      currency: "NGN",
      email,
      status: "pending",
    });
  }

  const paystackData = {
    email,
    amount: Math.round(order.totalPrice * 100), // Convert to kobo
    reference,
    currency: "NGN",
    callback_url: `${process.env.FRONTEND_VERIFY_PAYMENT_URL}`,
  };

  // Initialize Paystack payment
  const response = await axios.post<PaystackResponse>(
    "https://api.paystack.co/transaction/initialize",
    paystackData,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  successResponse(res, response.data.data, "Payment initialized successfully");
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { reference } = req.query as { reference?: string };

  if (!reference?.trim()) {
    throw BadRequest("Payment reference is required");
  }

  // Verify with Paystack
  const response = await axios.get<PaystackResponse>(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET_KEY}`,
      },
    }
  );

  const { data } = response.data;

  if (!data.status || data.status !== "success") {
    throw BadRequest("Payment verification failed");
  }

  // Update order
  const order = await Order.findById(reference);
  if (!order) {
    throw NotFound("Order not found");
  }

  order.isPaid = true;
  order.paidAt = new Date(data.paid_at || new Date());
  order.paymentResult = {
    id: data.id || "",
    status: data.status,
    update_time: data.paid_at || new Date().toISOString(),
    email_address: data.customer?.email || "",
  };
  await order.save();

  // Update transaction
  await Transaction.findOneAndUpdate(
    { reference },
    { 
      status: "success",
      paidAt: new Date(data.paid_at || new Date()) 
    }
  );

  successResponse(res, { order }, "Payment verified successfully");
});

export { initializePayment, verifyPayment };