import express from "express";
import {
  createRazorpayOrder,
  getAllPayments,
  saveOnlinePayment,
  getUserPayments,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-order", createRazorpayOrder);
router.post("/save", saveOnlinePayment);
router.get("/", getAllPayments);
router.get("/user/:userId", getUserPayments);
export default router;
