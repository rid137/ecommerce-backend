import Joi from "joi";
import mongoose from "mongoose";

const objectId = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
    }
    return value;
}, "ObjectId Validation");

export const createOrderSchema = Joi.object({
    orderItems: Joi.array().items(
        Joi.object({
        _id: objectId.required(),
        name: Joi.string().required(),
        qty: Joi.number().required(),
        image: Joi.string().required(),
        price: Joi.number().required(),
        })
    ).min(1).required(),

    shippingAddress: Joi.object({
        address: Joi.string().required(),
        city: Joi.string().required(),
        postalCode: Joi.string().required(),
        country: Joi.string().required(),
    }).required(),

    paymentMethod: Joi.string().required(),
});

export const orderPaymentSchema = Joi.object({
    id: Joi.string().required(),
    status: Joi.string().required(),
    update_time: Joi.string().required(),
    payer: Joi.object({
        email_address: Joi.string().email().required(),
    }).required(),
});