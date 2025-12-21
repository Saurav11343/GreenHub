import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.post("/", createCategory);

router.get("/", getAllCategory);

router.get("/:id", getCategoryById);

router.put("/:id", updateCategory);

router.delete("/:id", deleteCategory);

export default router;
