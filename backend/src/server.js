import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import plantRoutes from "./routes/plant.routes.js";
import cartItemRoutes from "./routes/cartItem.routes.js";

import { connectDB } from "./lib/db.js";
import { seedRoles } from "./utils/seedRole.js";

import { ENV } from "./lib/env.js";

const app = express();
const __dirname = path.resolve();

const PORT = ENV.PORT;

app.use(express.json()); //req.body
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/plant", plantRoutes);
app.use("/api/cartItem", cartItemRoutes);

if (ENV.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, async () => {
  console.log("Server running on port : " + PORT);
  await connectDB();
  await seedRoles();
});
