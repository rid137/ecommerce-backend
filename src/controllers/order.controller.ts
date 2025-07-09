import { Request, Response } from "express";
import { createdResponse, paginatedResponse, successResponse } from "../utils/apiResponse";
import orderService from "../services/order.service";
import { UserDocument } from "../models/user.model";
import { AuthenticatedRequest } from "../utils/authTypes";

// interface AuthenticatedRequest extends Request {
//   user?: UserDocument;
// }

class OrderController {
  async createOrder(req: AuthenticatedRequest, res: Response) {
    const { orderItems, shippingAddress, paymentMethod } = req.body;
    const userId = req.user?._id

    const order = await orderService.createOrder(userId!, orderItems, shippingAddress, paymentMethod);
    createdResponse(res, order, "Order created successfully");
  }

  async getAllOrders(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;

    const { orders, pagination } = await orderService.getAllOrders(page, size);
    paginatedResponse(res, orders, pagination, "Orders retrieved successfully");
  }

  async getUserOrders(req: AuthenticatedRequest, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;
    const userId = req.user?._id

    const { orders, pagination } = await orderService.getUserOrders(userId!, page, size);
    paginatedResponse(res, orders, pagination, "User orders retrieved successfully");
  }

  async findOrderById(req: Request, res: Response) {
    const order = await orderService.findOrderById(req.params.id);
    successResponse(res, order, "Order retrieved successfully");
  }

  async markOrderAsPaid(req: Request, res: Response) {
    const updated = await orderService.markAsPaid(req.params.id, req.body);
    successResponse(res, updated, "Order marked as paid");
  }

  async markOrderAsDelivered(req: Request, res: Response) {
    const updated = await orderService.markAsDelivered(req.params.id);
    successResponse(res, updated, "Order marked as delivered");
  }

  async countTotalOrders(_req: Request, res: Response) {
    const totalOrders = await orderService.countTotalOrders();
    successResponse(res, { totalOrders }, "Total orders count retrieved");
  }

  async calculateTotalSales(_req: Request, res: Response) {
    const totalSales = await orderService.calculateTotalSales();
    successResponse(res, { totalSales }, "Total sales calculated");
  }

  async calculateTotalSalesByDate(_req: Request, res: Response) {
    const result = await orderService.calculateTotalSalesByDate();
    successResponse(res, { salesByDate: result }, "Sales by date calculated");
  }
}

export default new OrderController();
