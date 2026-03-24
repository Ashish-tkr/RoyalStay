import { Router } from "express";
import {
  createApartment,
  getApartments,
  getApartmentById,
  updateApartment,
  deleteApartment,
  addFlat,
  updateFlat,
  deleteFlat,
  getFlats,
  getFlatById
} from "../Controllers/apartmentController.js";

import { protect, requireRole } from "../middleware/authMiddleware.js";
import { authenticateAdmin } from "../middleware/adminAuthMiddleware.js";


const router = Router();

// Public
router.get("/", getApartments);
router.get("/:id", getApartmentById);

// Admin only
router.post("/", authenticateAdmin, createApartment);
router.put("/:id", authenticateAdmin, updateApartment);
router.delete("/:id", authenticateAdmin, deleteApartment);

// Admin only - Flat CRUD (nested inside apartment)
router.post("/:id/flats", authenticateAdmin, addFlat);
router.put("/:id/flats/:flatId", authenticateAdmin, updateFlat);
router.delete("/:id/flats/:flatId", authenticateAdmin, deleteFlat);

// Flats (nested)
router.get("/:id/flats", getFlats);
router.get("/:id/flats/:flatId", getFlatById);

export default router;
