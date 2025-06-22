import Category from "../models/category.model";
import { Conflict, NotFound } from "../errors/httpErrors";

class CategoryService {
  async createCategory(name: string) {
    const exists = await Category.findOne({ name });
    if (exists) throw Conflict("Category already exists");

    return await Category.create({ name: name.trim() });
  }

  async updateCategory(id: string, name: string) {
    const category = await Category.findById(id);
    if (!category) throw NotFound("Category not found");

    const duplicate = await Category.findOne({ name, _id: { $ne: id } });
    if (duplicate) throw Conflict("Category name already exists");

    category.name = name.trim();
    return await category.save();
  }

  async deleteCategory(id: string) {
    const removed = await Category.findByIdAndDelete(id);
    if (!removed) throw NotFound("Category not found");
    return removed;
  }

  async getAllCategories(page: number, size: number) {
    const perPage = size || 10;
    const currentPage = page || 1;

    const [categories, total] = await Promise.all([
      Category.find({})
        .sort({ name: 1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage),
      Category.countDocuments(),
    ]);

    return {
      categories,
      pagination: {
        currentPage,
        perPage,
        totalDocuments: total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async getCategoryById(id: string) {
    const category = await Category.findById(id);
    if (!category) throw NotFound("Category not found");
    return category;
  }
}

export default new CategoryService();