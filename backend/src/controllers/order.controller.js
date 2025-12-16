import OrderDetail from "../models/OrderDetail.js";
import Order from "../models/Order.js";
import CartItem from "../models/CartItem.js";
import User from "../models/User.js";

import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdSchema,
  userIdSchema,
} from "../../../shared/validations/order.validation.js";

export const createOrder = async (req, res) => {
  try {
    /**
     * 1️⃣ Validate only user-provided fields
     */
    const validation = createOrderSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { userId, shippingAddress } = validation.data;

    /**
     * 2️⃣ Validate user
     */
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /**
     * 3️⃣ Fetch cart items (SOURCE OF TRUTH)
     */
    const cartItems = await CartItem.find({ userId }).populate(
      "plantId",
      "price name"
    );

    if (!cartItems.length) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    /**
     * 4️⃣ Calculate total price (SERVER SIDE)
     */
    let calculatedTotal = 0;

    const orderDetails = cartItems.map((item) => {
      const price = item.plantId.price;
      const quantity = item.quantity;

      calculatedTotal += price * quantity;

      return {
        plantId: item.plantId._id,
        quantity,
        price,
      };
    });

    /**
     * 5️⃣ Create order
     */
    const newOrder = await Order.create({
      userId,
      totalAmount: calculatedTotal,
      shippingAddress,
      status: "Pending",
    });

    /**
     * 6️⃣ Create order details
     */
    const orderDetailsWithOrderId = orderDetails.map((detail) => ({
      ...detail,
      orderId: newOrder._id,
    }));

    await OrderDetail.insertMany(orderDetailsWithOrderId);

    /**
     * 7️⃣ Clear cart AFTER successful order creation
     */
    await CartItem.deleteMany({ userId });

    /**
     * 8️⃣ Success response
     */
    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        orderId: newOrder._id,
        totalAmount: calculatedTotal,
      },
    });
  } catch (error) {
    console.error("Error in createOrder controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const validation = userIdSchema.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { id: userId } = validation.data;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();

    if (orders.length === 0) {
      return res.status(200).json({
        success: true,
        total: 0,
        message: "No orders found",
        orders: [],
      });
    }

    const orderIds = orders.map((o) => o._id);

    const details = await OrderDetail.find({
      orderId: { $in: orderIds },
    }).populate("plantId", "name price imageUrl");

    const ordersWithDetails = orders.map((order) => ({
      ...order,
      items: details.filter(
        (d) => d.orderId.toString() === order._id.toString()
      ),
    }));

    return res.status(200).json({
      success: true,
      total: orders.length,
      orders: ordersWithDetails,
    });
  } catch (error) {
    console.log("Error in getUserOrders controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const validation = orderIdSchema.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { id: orderId } = validation.data;

    const order = await Order.findById(orderId).lean();
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const orderDetails = await OrderDetail.find({ orderId }).populate(
      "plantId",
      "name price imageUrl"
    );

    const orderWithItems = {
      ...order,
      items: orderDetails,
    };

    return res.status(200).json({
      success: true,
      order: orderWithItems,
    });
  } catch (error) {
    console.log("Error in getOrderById controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const idValidation = orderIdSchema.safeParse(req.params);
    if (!idValidation.success) {
      return res.status(400).json({
        success: false,
        errors: idValidation.error.flatten().fieldErrors,
      });
    }

    const { id: orderId } = idValidation.data;

    const bodyValidation = updateOrderStatusSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        success: false,
        errors: bodyValidation.error.flatten().fieldErrors,
      });
    }

    const { status } = bodyValidation.data;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    const updatedOrder = await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.log("Error in updateOrderStatus controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const validation = orderIdSchema.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { id: orderId } = validation.data;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered orders cannot be cancelled",
      });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled",
      });
    }

    order.status = "Cancelled";
    const cancelledOrder = await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: cancelledOrder,
    });
  } catch (error) {
    console.log("Error in cancelOrder controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "firstName lastName email")
      .lean();

    if (orders.length === 0) {
      return res.status(200).json({
        success: true,
        total: 0,
        message: "No orders found",
        orders: [],
      });
    }

    const orderIds = orders.map((o) => o._id);

    const details = await OrderDetail.find({
      orderId: { $in: orderIds },
    }).populate("plantId", "name price imageUrl");

    const ordersWithDetails = orders.map((order) => ({
      ...order,
      items: details.filter(
        (d) => d.orderId.toString() === order._id.toString()
      ),
    }));

    return res.status(200).json({
      success: true,
      total: orders.length,
      orders: ordersWithDetails,
    });
  } catch (error) {
    console.log("Error in getAllOrders controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
