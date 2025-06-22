import Joi from "joi";

export const initializePaymentSchema = Joi.object({
  orderId: Joi.string().required().length(24),
  email: Joi.string().email().required()
});

export const verifyPaymentSchema = Joi.object({
  reference: Joi.string().required()
});