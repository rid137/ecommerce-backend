import Joi from "joi";
import mongoose from "mongoose";

export const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId Validation");

export const createProductSchema = Joi.object({
  name: Joi.string().trim().required(),
  brand: Joi.string().trim().required(),
  quantity: Joi.number().required(),
  category: objectId.required(),
  description: Joi.string().required(),
  images: Joi.array().items(Joi.string()).min(1).required(),
  price: Joi.number().required(),
  countInStock: Joi.number().required(),
});

export const reviewProductSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().required(),
});

export const filterProductSchema = Joi.object({
  checked: Joi.array().items(objectId),
  radio: Joi.array().items(Joi.number()).length(2),
});