import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";
import categoryController from "../controllers/category.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { categorySchema } from "../validators/category.validator";

const router = express.Router();

router
  .route("/")
  .post(authenticate, authorizeAdmin, validateRequest(categorySchema), categoryController.createCategory)
  .get(categoryController.listCategory);

router
  .route("/:id")
  .put(authenticate, authorizeAdmin, categoryController.updateCategory)
  .delete(authenticate, authorizeAdmin, categoryController.removeCategory)
  .get(categoryController.readCategory);

export default router;
