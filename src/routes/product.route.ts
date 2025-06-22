import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";
import checkId from "../middlewares/checkId";
import {
  createProductSchema,
  reviewProductSchema,
  filterProductSchema,
} from "../validators/product.validator";
import productController from "../controllers/product.controller";
import { validateRequest } from "../middlewares/validateRequest";

const router = express.Router();

router.get("/", productController.fetchPaginatedProducts);
router.get("/allproducts", productController.fetchAllProducts);
router.get("/top", productController.fetchTopProducts);
router.get("/new", productController.fetchNewProducts);

router.post(
  "/",
  authenticate,
  authorizeAdmin,
  validateRequest(createProductSchema),
  productController.addProduct
);

router.route("/:id/reviews").post(authenticate, checkId, validateRequest(reviewProductSchema), productController.addProductReview);

router
  .route("/:id")
  .get(productController.fetchProductById)
  .put(authenticate, authorizeAdmin, validateRequest(createProductSchema), productController.updateProductDetails)
  .delete(authenticate, authorizeAdmin, productController.removeProduct);

router.post("/filtered-products", validateRequest(filterProductSchema), productController.filterProducts);

export default router;