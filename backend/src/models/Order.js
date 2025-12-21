import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "PaymentPending",
        "Confirmed",
        "Shipped",
        "Delivered",
        "PaymentFailed",
        "Cancelled",
      ],
      default: "PaymentPending",
    },
    shippingAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
