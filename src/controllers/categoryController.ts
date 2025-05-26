import Category from "../models/categoryModel";
import asyncHandler from "../middlewares/asyncHandler";
import { BadRequest, NotFound, Conflict } from "../errors/httpErrors";
import { createdResponse, paginatedResponse, successResponse } from "../utils/apiResponse";

// Create Category
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name?.trim()) {
    throw BadRequest("Category name is required");
  }

  const existing = await Category.findOne({ name });
  if (existing) {
    throw Conflict("Category already exists");
  }

  const category = await new Category({ name }).save();
  createdResponse(res, category, "Category created successfully");
});

// Update Category
const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  if (!name?.trim()) {
    throw BadRequest("Category name is required");
  }

  const category = await Category.findById(id);
  if (!category) {
    throw NotFound("Category not found");
  }

  const existing = await Category.findOne({ name, _id: { $ne: id } });
  if (existing) {
    throw Conflict("Category name already exists");
  }

  category.name = name;
  const updated = await category.save();
  successResponse(res, updated, "Category updated successfully");
});

// Delete Category
const removeCategory = asyncHandler(async (req, res) => {
  const removed = await Category.findByIdAndDelete(req.params.id);
  if (!removed) {
    throw NotFound("Category not found");
  }

  successResponse(res, removed, "Category deleted successfully");
});

// List All Categories
const listCategory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt(req.query.size as string) || 10;

  const [categories, total] = await Promise.all([
    Category.find({})
      .sort({ name: 1 })
      .skip((page - 1) * perPage)
      .limit(perPage),
    Category.countDocuments(),
  ]);

  paginatedResponse(res, categories, {
    currentPage: page,
    perPage,
    totalDocuments: total,
    totalPages: Math.ceil(total / perPage),
  }, "Categories retrieved successfully");
});

// Read Single Category
const readCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw NotFound("Category not found");
  }

  successResponse(res, category, "Category retrieved successfully");
});

export {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
};