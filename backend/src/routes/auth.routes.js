import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";

import {
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/check", protectRoute, (req, res) =>
  res.status(200).json({
    success: true,
    user: req.user,
  })
);

router.put("/update-profile", protectRoute, updateProfile);

export default router;
