import express from "express";

import {
  getAllPlantStock,
  getLowStockPlants,
  getPlantStockSummary,
  updatePlantStock,
} from "../controllers/plantStock.controller.js";
const router = express.Router();

router.get("/summary", getPlantStockSummary);
router.get("/plants", getAllPlantStock);
router.get("/low", getLowStockPlants);
router.patch("/plants/:id", updatePlantStock);

export default router;
