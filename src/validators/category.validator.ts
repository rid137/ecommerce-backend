import Joi from "joi";

export const categorySchema = Joi.object({
  name: Joi.string().trim().max(32).required().messages({
    "any.required": "Category name is required",
    "string.empty": "Category name cannot be empty",
    "string.max": "Category name must be at most 32 characters",
  }),
});