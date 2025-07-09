import { Request, Response } from "express";
import paymentService from "../services/payment.service";
import { successResponse } from "../utils/apiResponse";
import asyncHandler from "../middlewares/asyncHandler";

class PaymentController {
  async initializePayment(req: Request, res: Response) {
    const { orderId, email } = req.body;
    const result = await paymentService.initializePayment(orderId, email);
    successResponse(res, result, "Payment initialized successfully");
  }

  async verifyPayment(req: Request, res: Response) {
    const { reference } = req.query;
    const order = await paymentService.verifyPayment(reference as string);
    successResponse(res, { order }, "Payment verified successfully");
  }
}

export default new PaymentController();