import Payment from "../models/Payment.js";
import razorpay from "../lib/razorpay.js";
import Order from "../models/Order.js";

/**
 * CREATE RAZORPAY ORDER
 */
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    // ✅ SAFETY CHECK
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // ₹ → paise
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    });

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Razorpay Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create Razorpay order",
    });
  }
};

/**
 * SAVE PAYMENT AFTER SUCCESS
 */
export const saveOnlinePayment = async (req, res) => {
  try {
    const { orderId, userId, amount, status, transactionId } = req.body;

    const paymentDetails = await razorpay.payments.fetch(transactionId);

    // 2️⃣ Save payment record
    const payment = await Payment.create({
      orderId,
      userId,
      amount,
      method:
        paymentDetails.method === "upi"
          ? "UPI"
          : paymentDetails.method === "card"
          ? "Card"
          : "COD",
      status,
      transactionId,
    });

    await Order.findByIdAndUpdate(orderId, { status: "Paid" }, { new: true });

    res.json({
      success: true,
      message: "Payment successful.",
      payment,
    });
  } catch (error) {
    console.error("Save payment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save payment",
    });
  }
};
export const getAllPayments = async (req, res) => {
  try {
    const {
      status,
      method,
      userId,
      minAmount,
      maxAmount,
      dateRange, // 👈 from frontend
      sort,
    } = req.query;

    const filter = {};

    // Status filter
    if (status) filter.status = status;

    // Method filter
    if (method) filter.method = method;

    // User filter
    if (userId) filter.userId = userId;

    // Amount filter
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (!isNaN(minAmount)) filter.amount.$gte = Number(minAmount);
      if (!isNaN(maxAmount)) filter.amount.$lte = Number(maxAmount);
    }

    // ✅ DATE RANGE FILTER (SERVER SIDE)
    if (dateRange) {
      const now = new Date();
      let fromDate;
      let toDate = new Date();

      // End of today
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

    // Sorting
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
    console.error("Get payments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
    });
  }
};
