import { successResponse, createdResponse, paginatedResponse } from "../utils/apiResponse";
import asyncHandler from "../middlewares/asyncHandler";
import productService from "../services/product.service";

class ProductController {
  addProduct = asyncHandler(async (req, res) => {
    const product = await productService.createProduct(req.body);
    createdResponse(res, product, "Product created successfully");
  });

  updateProductDetails = asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(req.params.id, req.body);
    successResponse(res, product, "Product updated successfully");
  });

  removeProduct = asyncHandler(async (req, res) => {
    const product = await productService.deleteProduct(req.params.id);
    successResponse(res, product, "Product deleted successfully");
  });

  fetchPaginatedProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;
    const keyword = (req.query.keyword as string) || "";

    const { products, pagination } = await productService.fetchPaginatedProducts(keyword, page, size);
    paginatedResponse(res, products, pagination, "Products retrieved successfully");
  });

  fetchProductById = asyncHandler(async (req, res) => {
    const product = await productService.fetchProductById(req.params.id);
    successResponse(res, product, "Product retrieved successfully");
  });

  fetchAllProducts = asyncHandler(async (_req, res) => {
    const products = await productService.fetchAllProducts();
    successResponse(res, products, "Products retrieved successfully");
  });

  addProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body
    const review = await productService.addProductReview(req.params.id, req.user, rating, comment);
    createdResponse(res, review, "Review added successfully");
  });

  fetchTopProducts = asyncHandler(async (_req, res) => {
    const products = await productService.fetchTopProducts();
    successResponse(res, products, "Top products retrieved successfully");
  });

  fetchNewProducts = asyncHandler(async (_req, res) => {
    const products = await productService.fetchNewProducts();
    successResponse(res, products, "New products retrieved successfully");
  });

  filterProducts = asyncHandler(async (req, res) => {
    const { checked, radio } = req.body;
    const products = await productService.filterProductsByCategoryAndPrice(checked, radio);
    successResponse(res, products, "Filtered products retrieved successfully");
  });
};

export default new ProductController();