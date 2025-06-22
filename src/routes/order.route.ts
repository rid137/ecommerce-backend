import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";
import orderController from "../controllers/order.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { createOrderSchema, orderPaymentSchema } from "../validators/order.validator";

const router = express.Router();

router.route("/")
  .post(authenticate, validateRequest(createOrderSchema), orderController.createOrder)
  .get(authenticate, authorizeAdmin, orderController.getAllOrders);

router.get("/user", authenticate, orderController.getUserOrders);
router.get("/total-orders", orderController.countTotalOrders);
router.get("/total-sales", orderController.calculateTotalSales);
router.get("/total-sales-by-date", orderController.calculateTotalSalesByDate);
router.get("/:id", authenticate, orderController.findOrderById);
router.put("/:id/pay", authenticate, validateRequest(orderPaymentSchema), orderController.markOrderAsPaid);
router.put("/:id/deliver", authenticate, authorizeAdmin, orderController.markOrderAsDelivered);

export default router;