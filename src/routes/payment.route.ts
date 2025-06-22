import express from "express";
const router = express.Router();

import { authenticate } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import paymentController from "../controllers/payment.controller";
import { initializePaymentSchema, verifyPaymentSchema } from "../validators/payment.validator";


router
  .route("/initialize")
  .post(
    authenticate,
    validateRequest(initializePaymentSchema),
    paymentController.initializePayment
  );

router
  .route("/verify")
  .get(
    authenticate,
    validateRequest(verifyPaymentSchema),
    paymentController.verifyPayment
  );

export default router;