import express from "express";
import {
  createElectricEntry,
  getAllElectricEntries,
  getElectricEntryById,
  updateElectricEntry,
  deleteElectricEntry,
} from "../controllers/electric.controller.js";

import { getElectricDashboard } from "../controllers/electric.controller.js";

//import { loginUser } from "../controllers/login.controller.js";

const router = express.Router();

// ✅ Login API
//router.post("/login", loginUser);

// ✅ CRUD Routes
router.post("/", createElectricEntry);         // Create
router.get("/", getAllElectricEntries);        // Read all
router.get("/:id", getElectricEntryById);      // Read one
router.put("/:id", updateElectricEntry);       // Update
router.delete("/:id", deleteElectricEntry);    // Delete

// ✅ Dashboard API
router.post("/dashboard", getElectricDashboard);

export default router;