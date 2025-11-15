import express from "express";
import {
  createPlant,
  deletePlant,
  getAllPlants,
  getPlantByCategory,
  getPlantById,
  updatePlant,
} from "../controllers/plant.controller.js";

const router = express.Router();

router.post("/", createPlant);
router.get("/", getAllPlants);
router.get("/:id", getPlantById);
router.put("/:id", updatePlant);
router.delete("/:id", deletePlant);
router.get("/category/:id", getPlantByCategory);

export default router;
