import express from "express";
import {
  createRazorpayOrder,
  getAllPayments,
  getUserPayments,
  verifyAndCompletePayment,
  markPaymentFailed,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-order", createRazorpayOrder);
// router.post("/save", saveOnlinePayment);

router.post("/verify", verifyAndCompletePayment);

router.post("/failed", markPaymentFailed);

router.get("/", getAllPayments);
router.get("/user/:userId", getUserPayments);
export default router;
