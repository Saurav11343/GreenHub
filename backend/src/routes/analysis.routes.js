import express from "express";
import { getAdminDashboardSummary } from "../controllers/analysis.controller.js";

const router = express.Router();

router.get("/", getAdminDashboardSummary);

export default router;
