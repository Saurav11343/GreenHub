import express from "express";
import {
  createRazorpayOrder,
  getAllPayments,
  saveOnlinePayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-order", createRazorpayOrder);
router.post("/save", saveOnlinePayment);
router.get("/", getAllPayments);
export default router;
