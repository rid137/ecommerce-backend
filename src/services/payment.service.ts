import axios from "axios";
import Order from "../models/order.model";
import Transaction from "../models/transaction.model";
import { BadRequest, NotFound } from "../errors/httpErrors";

interface PaystackResponse {
  data: {
    authorization_url: string;
    reference: string;
    status: string;
    paid_at?: string;
    customer?: { email: string };
    id?: string;
  };
}

class PaymentService {
  async initializePayment(orderId: string, email: string) {
    const order = await Order.findById(orderId);
    if (!order) throw NotFound("Order not found");

    const reference = orderId;

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
      amount: Math.round(order.totalPrice * 100),
      reference,
      currency: "NGN",
      callback_url: process.env.FRONTEND_VERIFY_PAYMENT_URL,
    };

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

    return response.data.data;
  }

  async verifyPayment(reference: string) {
    const response = await axios.get<PaystackResponse>(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET_KEY}`,
        },
      }
    );

    const { data } = response.data;

    if (data.status !== "success") {
      throw BadRequest("Payment verification failed");
    }

    const order = await Order.findById(reference);
    if (!order) throw NotFound("Order not found");

    order.isPaid = true;
    order.paidAt = new Date(data.paid_at || new Date());
    order.paymentResult = {
      id: data.id || "",
      status: data.status,
      update_time: data.paid_at || new Date().toISOString(),
      email_address: data.customer?.email || "",
    };
    await order.save();

    await Transaction.findOneAndUpdate(
      { reference },
      {
        status: "success",
        paidAt: new Date(data.paid_at || new Date()),
      }
    );

    return order;
  }
}

export default new PaymentService();