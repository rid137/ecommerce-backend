import { createdResponse, paginatedResponse, successResponse } from "../utils/apiResponse";
import asyncHandler from "../middlewares/asyncHandler";
import orderService from "../services/order.service";

class OrderController {
  createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;
    const order = await orderService.createOrder(req.body.user._id, orderItems, shippingAddress, paymentMethod);
    createdResponse(res, order, "Order created successfully");
  });

  getAllOrders = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;

    const { orders, pagination } = await orderService.getAllOrders(page, size);
    paginatedResponse(res, orders, pagination, "Orders retrieved successfully");
  });

  getUserOrders = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;

    const { orders, pagination } = await orderService.getUserOrders(req.body.user._id, page, size);
    paginatedResponse(res, orders, pagination, "User orders retrieved successfully");
  });

  findOrderById = asyncHandler(async (req, res) => {
    const order = await orderService.findOrderById(req.params.id);
    successResponse(res, order, "Order retrieved successfully");
  });

  markOrderAsPaid = asyncHandler(async (req, res) => {
    const updated = await orderService.markAsPaid(req.params.id, req.body);
    successResponse(res, updated, "Order marked as paid");
  });

  markOrderAsDelivered = asyncHandler(async (req, res) => {
    const updated = await orderService.markAsDelivered(req.params.id);
    successResponse(res, updated, "Order marked as delivered");
  });

  countTotalOrders = asyncHandler(async (_req, res) => {
    const totalOrders = await orderService.countTotalOrders();
    successResponse(res, { totalOrders }, "Total orders count retrieved");
  });

  calculateTotalSales = asyncHandler(async (_req, res) => {
    const totalSales = await orderService.calculateTotalSales();
    successResponse(res, { totalSales }, "Total sales calculated");
  });

  calculateTotalSalesByDate = asyncHandler(async (_req, res) => {
    const result = await orderService.calculateTotalSalesByDate();
    successResponse(res, { salesByDate: result }, "Sales by date calculated");
  });
}


export default new OrderController();