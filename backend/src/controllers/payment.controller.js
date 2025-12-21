import razorpay from "../lib/razorpay.js";
import mongoose from "mongoose";

import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import OrderDetail from "../models/OrderDetail.js";
import Plant from "../models/Plant.js";
import CartItem from "../models/CartItem.js";

const mapRazorpayMethod = (method) => {
  switch (method) {
    case "upi":
      return "UPI";
    case "card":
      return "CARD";
    case "netbanking":
      return "NETBANKING";
    case "wallet":
      return "WALLET";
    case "emi":
      return "EMI";
    case "paylater":
      return "PAYLATER";
    default:
      return "UNKNOWN";
  }
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    });

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("error in createRazorpayOrder payment.controller:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create Razorpay order",
    });
  }
};

export const verifyAndCompletePayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId, userId, transactionId } = req.body;

    const order = await Order.findById(orderId).session(session);
    if (!order) throw new Error("Order not found");

    if (order.status !== "PaymentPending") {
      throw new Error("Order is not awaiting payment");
    }

    const paymentDetails = await razorpay.payments.fetch(transactionId);

    if (paymentDetails.status !== "captured") {
      throw new Error("Payment not successful");
    }

    const orderItems = await OrderDetail.find({ orderId }).session(session);
    if (!orderItems.length) {
      throw new Error("Order items not found");
    }

    for (const item of orderItems) {
      const result = await Plant.updateOne(
        {
          _id: item.plantId,
          stockQty: { $gte: item.quantity },
        },
        {
          $inc: { stockQty: -item.quantity },
        },
        { session }
      );

      if (result.modifiedCount === 0) {
        throw new Error("Insufficient stock for one or more plants");
      }
    }

    const payment = await Payment.create(
      [
        {
          orderId,
          userId,
          amount: order.totalAmount,
          method: mapRazorpayMethod(paymentDetails.method),
          status: "Success",
          transactionId,
        },
      ],
      { session }
    );

    await Order.updateOne(
      { _id: orderId },
      {
        status: "Confirmed",
        statusUpdatedAt: new Date(),
      },
      { session }
    );

    await CartItem.deleteMany({ userId }).session(session);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Payment verified. Order completed successfully.",
      payment: payment[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error(
      "error in verifyAndCompletePayment payment.controller:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message || "Payment verification failed",
    });
  }
};

export const markPaymentFailed = async (req, res) => {
  try {
    const { orderId, userId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "PaymentPending") {
      return res.status(400).json({
        success: false,
        message: "Order is not awaiting payment",
      });
    }

    const existing = await Payment.findOne({
      orderId,
      status: "Failed",
    });

    if (!existing) {
      await Payment.create({
        orderId,
        userId,
        amount: order.totalAmount,
        status: "Failed",
        method: "ONLINE",
      });
    }

    await Order.updateOne(
      { _id: orderId },
      {
        status: "PaymentFailed",
        statusUpdatedAt: new Date(),
      }
    );

    return res.json({
      success: true,
      message: "Payment failed. You can retry payment.",
    });
  } catch (err) {
    console.error("error in markPaymentFailed payment.controller:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to mark payment",
    });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const { status, method, userId, minAmount, maxAmount, dateRange, sort } =
      req.query;

    const filter = {};

    if (status) filter.status = status;

    if (method) filter.method = method;

    if (userId) filter.userId = userId;

    if (minAmount || maxAmount) {
      filter.amount = {};
      if (!isNaN(minAmount)) filter.amount.$gte = Number(minAmount);
      if (!isNaN(maxAmount)) filter.amount.$lte = Number(maxAmount);
    }

    if (dateRange) {
      const now = new Date();
      let fromDate;
      let toDate = new Date();

      toDate.setHours(23, 59, 59, 999);

      if (dateRange === "today") {
        fromDate = new Date();
        fromDate.setHours(0, 0, 0, 0);
      }

      if (dateRange === "7days") {
        fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 6);
        fromDate.setHours(0, 0, 0, 0);
      }

      if (dateRange === "month") {
        fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - 1);
        fromDate.setHours(0, 0, 0, 0);
      }

      filter.createdAt = {
        $gte: fromDate,
        $lte: toDate,
      };
    }

    const sortQuery = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    const payments = await Payment.find(filter)
      .populate("orderId", "totalAmount status")
      .sort(sortQuery);

    res.json({
      success: true,
      totalCount: payments.length,
      payments,
    });
  } catch (error) {
    console.error("error in getAllPayments payment.controller:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
    });
  }
};

export const getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;

    const { status, method, minAmount, maxAmount, dateRange, sort } = req.query;

    const filter = { userId };

    if (status) filter.status = status;

    if (method) filter.method = method;

    if (minAmount || maxAmount) {
      filter.amount = {};
      if (!isNaN(minAmount)) filter.amount.$gte = Number(minAmount);
      if (!isNaN(maxAmount)) filter.amount.$lte = Number(maxAmount);
    }

    if (dateRange) {
      let fromDate;
      const toDate = new Date();
      toDate.setHours(23, 59, 59, 999);

      if (dateRange === "today") {
        fromDate = new Date();
        fromDate.setHours(0, 0, 0, 0);
      }

      if (dateRange === "7days") {
        fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 6);
        fromDate.setHours(0, 0, 0, 0);
      }

      if (dateRange === "month") {
        fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - 1);
        fromDate.setHours(0, 0, 0, 0);
      }

      filter.createdAt = {
        $gte: fromDate,
        $lte: toDate,
      };
    }

    const sortQuery = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };


    const payments = await Payment.find(filter)
      .populate("orderId", "totalAmount status")
      .sort(sortQuery)
      .lean();


      return res.status(200).json({
      success: true,
      totalCount: payments.length,
      payments,
    });
  } catch (error) {
    console.error("error in getUserPayments payment.controller:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user payments",
    });
  }
};
