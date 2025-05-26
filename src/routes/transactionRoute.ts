import express from "express";
const router = express.Router();
import {
  removeTransaction,
  listTransaction,
  readTransaction,
  getUserTransaction,
} from "../controllers/transactionController";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";

router
  .route("/")
  .get(authenticate, authorizeAdmin, listTransaction);

router.route("/user").get(authenticate, getUserTransaction);

router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, removeTransaction)
  .get(authenticate, readTransaction);

export default router;