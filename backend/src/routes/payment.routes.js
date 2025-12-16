import express from "express";
import {
  createRazorpayOrder,
  saveOnlinePayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-order", createRazorpayOrder);
router.post("/save", saveOnlinePayment);

export default router;
