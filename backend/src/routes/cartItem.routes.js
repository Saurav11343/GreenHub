import express from "express";
import {
  addToCart,
  getUserCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from "../controllers/cartItem.controller.js";
const router = express.Router();

router.post("/", addToCart);
router.get("/:id", getUserCart);
router.put("/:id", updateCartItem);
router.delete("/:id", deleteCartItem);
router.delete("/user/:id", clearCart);

export default router;
