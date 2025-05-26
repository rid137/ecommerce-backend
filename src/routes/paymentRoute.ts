import express from "express";
const router = express.Router();

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";
import { initializePayment, verifyPayment } from "../controllers/paymentController";

router
  .route("/initialize")
  .post(authenticate, initializePayment)

router
  .route("/verify")
  .get(authenticate, verifyPayment)

export default router;