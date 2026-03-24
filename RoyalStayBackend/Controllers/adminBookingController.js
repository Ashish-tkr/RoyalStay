// controllers/adminBookingController.js
import Booking from "../models/booking.js";
import UserModel from "../models/User.js";

export const getAllBookingsGroupedByUser = async (req, res) => {
  try {
    // Fetch all bookings
    const bookings = await Booking.find()
      .populate("apartmentId", "name location") // optional populate for apartment
      .sort({ createdAt: -1 });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    // Group bookings by userId
    const grouped = {};
    for (let booking of bookings) {
      const userId = booking.userId.toString();
      if (!grouped[userId]) {
        grouped[userId] = [];
      }
      grouped[userId].push(booking);
    }

    // Build response array
    const response = [];
    for (let userId in grouped) {
      const user = await UserModel.findById(userId).select("-password -emailVerifyToken -emailVerifyTokenExpires");
      if (user) {
        response.push({
          userDetails: user,
          bookings: grouped[userId],
        });
      }
    }

    res.status(200).json({
      success: true,
      totalUsers: response.length,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching grouped bookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
