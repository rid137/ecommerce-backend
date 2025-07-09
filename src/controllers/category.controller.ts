import { Request, Response } from "express";
import { createdResponse, successResponse, paginatedResponse } from "../utils/apiResponse";
import categoryService from "../services/category.service";

class CategoryController {
  async createCategory(req: Request, res: Response) {
    const { name } = req.body;
    const category = await categoryService.createCategory(name);
    createdResponse(res, category, "Category created successfully");
  }

  async updateCategory(req: Request, res: Response) {
    const { name } = req.body;
    const { id } = req.params;
    const updated = await categoryService.updateCategory(id, name);
    successResponse(res, updated, "Category updated successfully");
  }

  async removeCategory(req: Request, res: Response) {
    const removed = await categoryService.deleteCategory(req.params.id);
    successResponse(res, removed, "Category deleted successfully");
  }

  async listCategory(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;

    const { categories, pagination } = await categoryService.getAllCategories(page, size);
    paginatedResponse(res, categories, pagination, "Categories retrieved successfully");
  }

  async readCategory(req: Request, res: Response) {
    const category = await categoryService.getCategoryById(req.params.id);
    successResponse(res, category, "Category retrieved successfully");
  }
}

export default new CategoryController();
