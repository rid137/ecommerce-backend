import express from "express";
const router = express.Router();
import {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
} from "../controllers/categoryController";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";

router
  .route("/")
  .post(authenticate, authorizeAdmin,  createCategory)
  .get(listCategory);

router
  .route("/:id")
  .put(authenticate, authorizeAdmin, updateCategory)
  .delete(authenticate, authorizeAdmin, removeCategory)
  .get(readCategory);

export default router;