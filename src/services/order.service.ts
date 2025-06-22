import Order from "../models/order.model";
import Product from "../models/product.model";
import { NotFound } from "../errors/httpErrors";
import { OrderItemInput } from "../dtos/createOrder.dto";

function calcPrices(orderItems: OrderItemInput[]) {
    const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxRate = 0.15;
    const taxPrice = +(itemsPrice * taxRate).toFixed(2);
    const totalPrice = +(itemsPrice + shippingPrice + taxPrice).toFixed(2);

    return {
        itemsPrice: +itemsPrice.toFixed(2),
        shippingPrice: +shippingPrice.toFixed(2),
        taxPrice,
        totalPrice,
    };
}

class OrderService {
    async createOrder(userId: string, orderItems: OrderItemInput[], shippingAddress: any, paymentMethod: string) {
        const itemsFromDB = await Product.find({ _id: { $in: orderItems.map(i => i._id) } });

        const dbOrderItems = orderItems.map(item => {
        const match = itemsFromDB.find(prod => prod._id.toString() === item._id);
        if (!match) throw NotFound(`Product not found: ${item._id}`);
        return {
            ...item,
            product: item._id,
            price: match.price,
        };
        });

        const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrices(dbOrderItems);

        const order = new Order({
        orderItems: dbOrderItems,
        user: userId,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        });

        return await order.save();
    }

    async getAllOrders(page: number, size: number) {
        const perPage = size || 10;
        const currentPage = page || 1;

        const [orders, total] = await Promise.all([
        Order.find({})
            .populate("user", "id username")
            .skip((page - 1) * size)
            .limit(size),
        Order.countDocuments()
        ]);
        
        return {
            orders,
            pagination: {
                currentPage,
                perPage,
                totalDocuments: total,
                totalPages: Math.ceil(total / perPage),
            },
        };
    }

    async getUserOrders(userId: string, page: number, size: number) {
        const perPage = size || 10;
        const currentPage = page || 1;

        const [orders, total] = await Promise.all([
            Order.find({ user: userId })
            .skip((page - 1) * size)
            .limit(size),
            Order.countDocuments({ user: userId })
        ]);

        return {
            orders,
            pagination: {
                currentPage,
                perPage,
                totalDocuments: total,
                totalPages: Math.ceil(total / perPage),
            },
        };
    }

    async findOrderById(id: string) {
        const order = await Order.findById(id)
        .populate("user", "username email")
        .populate("orderItems.product", "name images");

        if (!order) throw NotFound("Order not found");
        return order;
    }

    async markAsPaid(id: string, paymentData: any) {
        const order = await Order.findById(id);
        if (!order) throw NotFound("Order not found");

        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = {
        id: paymentData.id,
        status: paymentData.status,
        update_time: paymentData.update_time,
        email_address: paymentData.payer?.email_address || "",
        };

        return await order.save();
    }

    async markAsDelivered(id: string) {
        const order = await Order.findById(id);
        if (!order) throw NotFound("Order not found");

        order.isDelivered = true;
        order.deliveredAt = new Date();
        return await order.save();
    }

    async countTotalOrders() {
        return await Order.countDocuments();
    }

    async calculateTotalSales() {
        const orders = await Order.find({ isPaid: true });
        const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        return totalSales;
    }

    async calculateTotalSalesByDate() {
        return await Order.aggregate([
        { $match: { isPaid: true } },
        {
            $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
            totalSales: { $sum: "$totalPrice" },
            count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } }
        ]);
    }
}

export default new OrderService();