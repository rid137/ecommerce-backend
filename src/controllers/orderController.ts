import { CreateOrderDto, OrderItemInput } from "../dtos/createOrder.dto";
import asyncHandler from "../middlewares/asyncHandler";
import Order from "../models/orderModel";
import Product from "../models/productModel";
import { successResponse, createdResponse, paginatedResponse } from "../utils/apiResponse";
import { BadRequest, NotFound } from "../errors/httpErrors";


function calcPrices(orderItems: OrderItemInput[]) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);
  const totalPrice = (itemsPrice + shippingPrice + parseFloat(taxPrice)).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod }: CreateOrderDto = req.body;

  if (!orderItems || orderItems.length === 0) {
    throw BadRequest("No order items");
  }

  const itemsFromDB = await Product.find({
    _id: { $in: orderItems.map((x) => x._id) },
  });

  const dbOrderItems = orderItems.map((itemFromClient) => {
    const matchingItemFromDB = itemsFromDB.find(
      (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
    );

    if (!matchingItemFromDB) {
      throw NotFound(`Product not found: ${itemFromClient._id}`);
    }

    return {
      ...itemFromClient,
      product: itemFromClient._id,
      price: matchingItemFromDB.price,
    };
  });

  const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);

  const order = new Order({
    orderItems: dbOrderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();
  createdResponse(res, createdOrder, "Order created successfully");
});

const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt(req.query.size as string) || 10;
  
  const [orders, total] = await Promise.all([
    Order.find({})
      .populate("user", "id username") // Populate user only id and username
      .skip((page - 1) * perPage) 
      .limit(perPage),
    Order.countDocuments()
  ]);

  paginatedResponse(res, orders, {
    currentPage: page,
    perPage,
    totalDocuments: total,
    totalPages: Math.ceil(total / perPage),
  }, "Orders retrieved successfully");
});

const getUserOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt(req.query.size as string) || 20;
  
  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id })
      .skip((page - 1) * perPage)
      .limit(perPage),
    Order.countDocuments({ user: req.user._id })
  ]);

  paginatedResponse(res, orders, {
    currentPage: page,
    perPage,
    totalDocuments: total,
    totalPages: Math.ceil(total / perPage),
  }, "User orders retrieved successfully");
});

const countTotalOrders = asyncHandler(async (_req, res) => {
  const totalOrders = await Order.countDocuments();
  successResponse(res, { totalOrders }, "Total orders count retrieved");
});

const calculateTotalSales = asyncHandler(async (_req, res) => {
  const orders = await Order.find({ isPaid: true });
  const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  successResponse(res, { totalSales }, "Total sales calculated");
});

const calculateTotalSalesByDate = asyncHandler(async (_req, res) => {
  const salesByDate = await Order.aggregate([
    {
      $match: {
        isPaid: true,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
        },
        totalSales: { $sum: "$totalPrice" },
        count: { $sum: 1 }
      },
    },
    { $sort: { _id: 1 } }
  ]);

  successResponse(res, { salesByDate }, "Sales by date calculated");
});

const findOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "username email")
    .populate("orderItems.product", "name images");

  if (!order) {
    throw NotFound("Order not found");
  }

  successResponse(res, order, "Order retrieved successfully");
});

const markOrderAsPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    throw NotFound("Order not found");
  }

  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer?.email_address || "",
  };

  const updatedOrder = await order.save();
  successResponse(res, updatedOrder, "Order marked as paid");
});

const markOrderAsDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    throw NotFound("Order not found");
  }

  order.isDelivered = true;
  order.deliveredAt = new Date();

  const updatedOrder = await order.save();
  successResponse(res, updatedOrder, "Order marked as delivered");
});

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
};