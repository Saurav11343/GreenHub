import express from "express";
import {
  createPlant,
  deletePlant,
  getAllPlantCareTips,
  getAllPlants,
  getPlantByCategory,
  getPlantById,
  getPlantCareTipById,
  updateCareInstructions,
  updatePlant,
} from "../controllers/plant.controller.js";

const router = express.Router();

router.post("/", createPlant);
router.get("/", getAllPlants);
router.get("/:id", getPlantById);
router.put("/:id", updatePlant);
router.delete("/:id", deletePlant);
router.get("/category/:id", getPlantByCategory);
router.patch("/careInstructions/:plantId", updateCareInstructions);
router.get("/careInstructions", getAllPlantCareTips);
router.get("/careInstructions/:plantId", getPlantCareTipById);
export default router;
