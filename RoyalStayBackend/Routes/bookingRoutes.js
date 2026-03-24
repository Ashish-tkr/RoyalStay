// =============================================================================
// BOOKING ROUTES
// =============================================================================

import { Router } from "express";
import {
  createBooking,
  verifyPayment,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  getBookingById,
} from "../Controllers/bookingController.js";
import { getActiveBookings, getInactiveBookings, getUserBookingHistory } from "../Controllers/getUserBookingHistory .js";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";
import { getUserToken } from "../middleware/userBookingController.js";
import { protect } from '../middleware/authMiddleware.js'; // Your auth middleware
import { getAllApartments, getFeaturedApartments } from "../Controllers/getFeaturedApartments.js";
import { getAllBookingsGroupedByUser } from "../Controllers/adminBookingController.js";

const router = Router();
//router.use(protect); // Protect all booking routes 

router.post("/", getUserToken, createBooking); // Create new booking
router.get("/my-bookings", getMyBookings); // User's bookings
router.get('/history', authMiddleware, getUserBookingHistory); // Booking history with filters
router.get('/active',authMiddleware, getActiveBookings)
router.get('/inactive',authMiddleware,  getInactiveBookings) // Inactive bookings
router.put("/:id/cancel",authMiddleware, cancelBooking); // Cancel booking
router.post("/verify-payment", authMiddleware, verifyPayment); // Verify payment
router.get('/featured', getFeaturedApartments);
router.get('/', getAllApartments);
router.get("/:id", getBookingById); // Get single booking



// Admin routes
router.get("/admin/all", requireRole("admin"), getAllBookings); // All bookings
router.put("/:id/status", requireRole("admin"), updateBookingStatus); // Update status
router.get("/admin/details", getAllBookingsGroupedByUser);

// =============================================================================
// HELPER FUNCTIONS FOR AVAILABILITY CHECKING
// =============================================================================

// Check flat availability for given dates
export const checkFlatAvailability = async (apartmentId, flatId, checkIn, checkOut, excludeBookingId = null) => {
  const filter = {
    apartmentId,
    flatId,
    status: { $in: ["confirmed", "pending"] },
    $or: [
      {
        checkInDate: { $lte: new Date(checkOut) },
        checkOutDate: { $gte: new Date(checkIn) }
      }
    ]
  };
  
  if (excludeBookingId) {
    filter._id = { $ne: excludeBookingId };
  }
  
  const conflictingBooking = await Booking.findOne(filter);
  return !conflictingBooking;
};

// Get available flats for an apartment on specific dates
export const getAvailableFlats = async (apartmentId, checkIn, checkOut) => {
  const apartment = await Apartment.findById(apartmentId);
  if (!apartment) return [];
  
  const availableFlats = [];
  
  for (const flat of apartment.flats) {
    const isAvailable = await checkFlatAvailability(apartmentId, flat._id, checkIn, checkOut);
    if (isAvailable) {
      availableFlats.push(flat);
    }
  }
  
  return availableFlats;
};



export default router;