import express from "express";
// import formidable from "express-formidable";
const router = express.Router();

// controllers
import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchPaginatedProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../controllers/productController";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware";
import checkId from "../middlewares/checkId";

router
  .route("/")
  .get(fetchPaginatedProducts)
  // .post(authenticate, authorizeAdmin, formidable(), addProduct);
  .post(authenticate, authorizeAdmin, addProduct);

router.route("/allproducts").get(fetchAllProducts);
router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router
  .route("/:id")
  .get(fetchProductById)
  // .put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
  .put(authenticate, authorizeAdmin, updateProductDetails)
  .delete(authenticate, authorizeAdmin, removeProduct);

router.route("/filtered-products").post(filterProducts);

export default router;
