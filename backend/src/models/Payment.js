import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: [
        "UPI",
        "CARD",
        "NETBANKING",
        "WALLET",
        "EMI",
        "PAYLATER",
        "ONLINE",
        "UNKNOWN",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
    transactionId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
