import Joi from "joi";
import { objectId } from "./product.validator";

export const transactionFilterSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  size: Joi.number().integer().min(10).optional(),
  transactionId: objectId.optional(),
  status: Joi.string().valid("pending", "success", "failed").optional(),
  from: Joi.date().iso().optional(),
  to: Joi.date().iso().optional()
});