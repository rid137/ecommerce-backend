import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";
import transactionController from "../controllers/transaction.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { transactionFilterSchema } from "../validators/transaction.validator";

const router = express.Router();

router
  .route("/")
  .get(
    authenticate,
    authorizeAdmin,
    validateRequest(transactionFilterSchema),
    transactionController.listTransactions
  );

router
  .route("/user")
  .get(authenticate, transactionController.getUserTransactions);

router
  .route("/:id")
  .get(authenticate, transactionController.readTransaction)
  .delete(authenticate, authorizeAdmin, transactionController.removeTransaction);

export default router;