import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", createOrder);

router.get("/user/:id", getUserOrders);

router.get("/:id", getOrderById);

router.put("/status/:id", updateOrderStatus);

router.put("/cancel/:id", cancelOrder);

router.get("/", getAllOrders);

export default router;
