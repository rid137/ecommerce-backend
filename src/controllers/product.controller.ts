import { Request, Response } from "express";
import { successResponse, createdResponse, paginatedResponse } from "../utils/apiResponse";
import asyncHandler from "../middlewares/asyncHandler";
import productService from "../services/product.service";

class ProductController {
  async addProduct(req: Request, res: Response) {
    const product = await productService.createProduct(req.body);
    createdResponse(res, product, "Product created successfully");
  }

  async updateProductDetails(req: Request, res: Response) {
    const product = await productService.updateProduct(req.params.id, req.body);
    successResponse(res, product, "Product updated successfully");
  }

  async removeProduct(req: Request, res: Response) {
    const product = await productService.deleteProduct(req.params.id);
    successResponse(res, product, "Product deleted successfully");
  }

  async fetchPaginatedProducts(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;
    const keyword = (req.query.keyword as string) || "";

    const { products, pagination } = await productService.fetchPaginatedProducts(keyword, page, size);
    paginatedResponse(res, products, pagination, "Products retrieved successfully");
  }

  async fetchProductById(req: Request, res: Response) {
    const product = await productService.fetchProductById(req.params.id);
    successResponse(res, product, "Product retrieved successfully");
  }

  async fetchAllProducts(req: Request, res: Response) {
    const products = await productService.fetchAllProducts();
    successResponse(res, products, "Products retrieved successfully");
  }

  async addProductReview(req: Request, res: Response) {
    // const { rating, comment } = req.body;
    // const review = await productService.addProductReview(req.params.id, req.user, rating, comment);
    // createdResponse(res, review, "Review added successfully");
  }

  async fetchTopProducts(req: Request, res: Response) {
    const products = await productService.fetchTopProducts();
    successResponse(res, products, "Top products retrieved successfully");
  }

  async fetchNewProducts(req: Request, res: Response) {
    const products = await productService.fetchNewProducts();
    successResponse(res, products, "New products retrieved successfully");
  }

  async filterProducts(req: Request, res: Response) {
    const { checked, radio } = req.body;
    const products = await productService.filterProductsByCategoryAndPrice(checked, radio);
    successResponse(res, products, "Filtered products retrieved successfully");
  }
}

export default new ProductController();