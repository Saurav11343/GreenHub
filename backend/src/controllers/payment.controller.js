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
    console.error("Razorpay Error:", error)

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


    await Order.findByIdAndUpdate(
      orderId,
      { status: "Paid" },
      { new: true }
    );

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
