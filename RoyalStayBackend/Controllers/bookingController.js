// =============================================================================
// BOOKING CONTROLLER (FIXED)
// =============================================================================

import Booking from "../models/booking.js";
import Apartment from "../models/adminApartment.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { handleBookingConfirmation } from "./confermationMailSend.js";

// Initialize Razorpay (optional but recommended)
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Helper: get userId from token (supports id or _id)
const getUserId = (req) => req.user?.id || req.user?._id;

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (User)
export const createBooking = async (req, res) => {
  try {
    console.log("➡️ Entered createBooking");

    const {
      apartmentId,
      flatId,
      guestInfo,
      checkInDate,
      checkOutDate,
      adults,
      children,
      arrivalTime,
      specialRequests,
    } = req.body;

    console.log("📩 Request body:", req.body);

    const userId = getUserId(req);
    console.log("👤 User ID:", userId);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Basic validation
    if (!apartmentId || !flatId) {
      console.log("❌ Validation failed: apartmentId/flatId missing");
      return res.status(400).json({ message: "apartmentId and flatId are required" });
    }
    if (!guestInfo?.firstName || !guestInfo?.lastName || !guestInfo?.email || !guestInfo?.phone) {
      console.log("❌ Validation failed: guestInfo incomplete");
      return res.status(400).json({ message: "Guest info is incomplete" });
    }
    if (!checkInDate || !checkOutDate) {
      console.log("❌ Validation failed: dates missing");
      return res.status(400).json({ message: "checkInDate and checkOutDate are required" });
    }

    console.log("✅ Validation passed");

    // Fetch apartment and flat details
    console.log("🔎 Fetching apartment:", apartmentId);
    const apartment = await Apartment.findById(apartmentId);
    console.log("🏢 Apartment found:", apartment ? apartment.name : null);
    if (!apartment) return res.status(404).json({ message: "Apartment not found" });

    let flat = apartment.flats?.id?.(flatId);
    if (!flat) {
      flat = apartment.flats?.find?.((f) => String(f?._id) === String(flatId));
    }
    console.log("🏠 Flat found:", flat ? flat.title : null);
    if (!flat) return res.status(404).json({ message: "Flat not found" });

    // Validate guest count
    const totalGuests = Number(adults || 0) + Number(children || 0);
    console.log("👥 Total guests:", totalGuests);
    if (totalGuests < 1) {
      return res.status(400).json({ message: "At least 1 guest is required" });
    }
    if (flat.maxOccupancy && totalGuests > flat.maxOccupancy) {
      return res.status(400).json({
        message: `Maximum ${flat.maxOccupancy} guests allowed for this flat`,
      });
    }

    // Dates & duration
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const msPerDay = 1000 * 60 * 60 * 24;
    const totalDays = Math.ceil((checkOut - checkIn) / msPerDay);

    console.log("📅 Dates:", { checkIn, checkOut, totalDays });

    if (!(checkIn instanceof Date) || isNaN(checkIn.getTime()) ||
        !(checkOut instanceof Date) || isNaN(checkOut.getTime())) {
      return res.status(400).json({ message: "Invalid dates" });
    }
    if (totalDays <= 0) {
      return res.status(400).json({ message: "checkOutDate must be after checkInDate" });
    }

    // Check for conflicting bookings
    console.log("🔎 Checking conflicting bookings...");
    const conflictingBooking = await Booking.findOne({
      apartmentId,
      flatId,
      status: { $in: ["confirmed", "pending"] },
      checkInDate: { $lte: new Date(checkOutDate) },
      checkOutDate: { $gte: new Date(checkInDate) },
    });
    console.log("⚠️ Conflicting booking:", conflictingBooking ? true : false);

    if (conflictingBooking) {
      return res.status(400).json({
        message: "This flat is not available for the selected dates",
      });
    }

    // Pricing
    const basePrice = Number(flat.price || 0);
    const subtotal = basePrice * totalDays;
    const taxes = +(subtotal * 0.18).toFixed(2);
    const serviceFee = +(subtotal * 0.05).toFixed(2);
    const finalAmount = +(subtotal + taxes + serviceFee).toFixed(2);

    console.log("💰 Pricing:", { basePrice, subtotal, taxes, serviceFee, finalAmount });

    // Transaction reference
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    console.log("🧾 Transaction ID:", transactionId);

    // Razorpay order
    let razorpayOrder = null;
    if (!razorpay) {
      console.warn("⚠️ Razorpay not configured. Skipping order creation.");
    } else {
      console.log("🪙 Creating Razorpay order...");
      try {
        razorpayOrder = await razorpay.orders.create({
          amount: Math.round(finalAmount * 100),
          currency: "INR",
          receipt: transactionId,
          notes: {
            apartmentId,
            flatId,
            userId: String(userId),
            checkInDate: checkIn.toISOString(),
            checkOutDate: checkOut.toISOString(),
          },
        });
        console.log("✅ Razorpay order created:", razorpayOrder.id);
      } catch (err) {
        console.error("❌ Razorpay error:", err.message);
      }
    }

    // Create booking
    console.log("📝 Creating booking...");
    const booking = new Booking({
      userId,
      apartmentId,
      flatId,
      apartmentDetails: {
        name: apartment.name,
        location: apartment.location,
        coverImage: apartment.coverImage,
      },
      flatDetails: {
        type: flat.type,
        title: flat.title,
        price: basePrice,
        size: flat.size,
        maxOccupancy: flat.maxOccupancy,
        bedrooms: flat.bedrooms,
        bathrooms: flat.bathrooms,
        images: flat.images,
        features: flat.features,
        amenities: flat.amenities,
      },
      guestInfo,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      adults: Number(adults || 0),
      children: Number(children || 0),
      totalGuests,
      arrivalTime,
      specialRequests,
      payment: {
        amount: finalAmount,
        currency: "INR",
        paymentStatus: "pending",
        razorpayOrderId: razorpayOrder?.id || null,
        transactionId,
      },
      pricing: {
        basePrice,
        totalDays,
        subtotal,
        taxes,
        serviceFee,
        discount: 0,
        finalAmount,
      },
      status: "pending",
    });

    await booking.save();
    console.log("✅ Booking saved:", booking._id);

    return res.status(201).json({
      success: true,
      booking,
      razorpayOrder: razorpayOrder
        ? {
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
          }
        : null,
      message: razorpay ? "Booking created, proceed to payment." : "Booking created (Razorpay not configured).",
    });
  } catch (error) {
    console.error("❌ Booking creation error:", error);
    return res.status(500).json({
      message: "Failed to create booking",
      error: error.message,
    });
  }
};


// @desc    Verify payment and confirm booking
// @route   POST /api/bookings/:id/verify-payment
// @access  Private (User)
export const verifyPayment = async (req, res) => {
  try {
    console.log("🔐 Payment verification started");
    console.log("📩 Request body:", req.body);
    
    const user = req.user;
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      bookingId,
      apartmentId,
      flatId,
      amount,
      currency
    } = req.body;

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      console.log("❌ Missing payment details");
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required payment details' 
      });
    }

    if (!bookingId) {
      console.log("❌ Missing booking ID");
      return res.status(400).json({ 
        success: false, 
        message: 'Missing booking ID' 
      }); 
    }

    // Check if Razorpay secret is configured
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("❌ Razorpay secret key not configured");
      return res.status(500).json({ 
        success: false, 
        message: 'Payment gateway not configured properly' 
      });
    }

    // Verify Razorpay signature
    console.log("🔍 Verifying Razorpay signature...");
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    console.log("🔐 Signature verification:", {
      expected: expectedSign,
      received: razorpay_signature,
      matches: razorpay_signature === expectedSign
    });

    if (razorpay_signature !== expectedSign) {
      console.log("❌ Payment signature verification failed");
      return res.status(400).json({ 
        success: false, 
        message: 'Payment verification failed - Invalid signature' 
      });
    }

    console.log("✅ Payment signature verified successfully");

    // Find the booking by ID
    console.log("🔎 Finding booking:", bookingId);
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.log("❌ Booking not found");
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    console.log("📋 Found booking, current status:", booking.status);

    // Check if booking belongs to the user (if using authentication)
    if (user && booking.userId && booking.userId.toString() !== user.id) {
      console.log("❌ Booking doesn't belong to user");
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized to access this booking' 
      });
    }

    // Check if payment is already processed
    if (booking.payment.paymentStatus === 'success') {
      console.log("⚠️ Payment already processed");
      return res.status(200).json({ 
        success: true, 
        message: 'Payment already verified',
        booking: booking
      });
    }

    // Update the booking with payment details
    console.log("💳 Updating booking with payment details...");
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: {
          'payment.paymentStatus': 'success',
          'payment.razorpayPaymentId': razorpay_payment_id, // Fixed field name
          'payment.razorpayOrderId': razorpay_order_id,     // Fixed field name
          'payment.razorpaySignature': razorpay_signature,   // Fixed field name
          'payment.paymentDate': new Date(),                 // Fixed field name
          status: 'confirmed'
        }
      },
      { new: true }
    );

    console.log("✅ Booking updated successfully");

    // Get populated booking data for response
    console.log("📄 Fetching populated booking data...");
    const populatedBooking = await Booking.findById(bookingId)
      .populate('apartmentId', 'name location coverImage')
      .lean(); // Use lean() for better performance

    // Send success response FIRST
    console.log("📤 Sending success response...");
    res.json({ 
      success: true, 
      message: 'Payment verified and booking confirmed successfully',
      booking: populatedBooking
    });

    // Send confirmation email AFTER response (fire and forget)
    console.log("📧 Triggering confirmation email...");
    handleBookingConfirmation(bookingId)
      .then(() => {
        console.log("✅ Confirmation email sent successfully");
      })
      .catch(err => {
        console.error("⚠️ Email sending failed (non-critical):", err.message);
      });

  } catch (error) {
    console.error('❌ Error in payment verification:', error);
    
    // Make sure we always send a response
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error during payment verification',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}; 

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (User)
export const getMyBookings = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const status = req.query.status;

    const filter = { userId };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);

    return res.json({
      bookings,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings/admin/all
// @access  Admin
export const getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const { status, paymentStatus, apartmentId, startDate, endDate } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter["payment.paymentStatus"] = paymentStatus;
    if (apartmentId) filter.apartmentId = apartmentId;

    // Date range filter (by checkInDate)
    if (startDate || endDate) {
      filter.checkInDate = {};
      if (startDate) filter.checkInDate.$gte = new Date(startDate);
      if (endDate) filter.checkInDate.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(filter)
      .populate("userId", "name email phone") // <-- match your real User fields
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);

    // Stats
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] },
          },
          totalRevenue: {
            $sum: {
              $cond: [
                { $eq: ["$payment.paymentStatus", "paid"] },
                "$payment.amount",
                0,
              ],
            },
          },
          pendingPayments: {
            $sum: {
              $cond: [
                { $eq: ["$payment.paymentStatus", "pending"] },
                "$payment.amount",
                0,
              ],
            },
          },
        },
      },
    ]);

    return res.json({
      bookings,
      stats: stats[0] || {
        totalBookings: 0,
        confirmedBookings: 0,
        totalRevenue: 0,
        pendingPayments: 0,
      },
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Admin
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const allowed = ["pending", "confirmed", "cancelled", "completed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    if (adminNotes) booking.adminNotes = adminNotes;

    if (status === "cancelled") {
      booking.cancellation = {
        cancelledAt: new Date(),
        cancelledBy: "admin",
        cancellationReason: adminNotes || "Cancelled by admin",
        refundEligible: booking.payment.paymentStatus === "paid",
      };
    }

    await booking.save();

    return res.json({
      success: true,
      message: `Booking ${status} successfully`,
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update booking status",
      error: error.message,
    });
  }
};

// @desc    Cancel booking (User)
// @route   PUT /api/bookings/:id/cancel
// @access  Private (User)
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const booking = await Booking.findOne({ _id: id, userId });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }
    if (booking.status === "completed") {
      return res.status(400).json({ message: "Cannot cancel completed booking" });
    }

    const hoursUntilCheckIn =
      (new Date(booking.checkInDate) - new Date()) / (1000 * 60 * 60);
    const refundEligible =
      hoursUntilCheckIn > 24 && booking.payment.paymentStatus === "paid";

    booking.status = "cancelled";
    booking.cancellation = {
      cancelledAt: new Date(),
      cancelledBy: "user",
      cancellationReason: reason || "Cancelled by user",
      refundEligible,
    };

    await booking.save();

    return res.json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
      refundEligible,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private (User/Admin)
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const userRole = req.user?.role; 

    const filter = { _id: id };
    if (userRole !== "admin") {
      filter.userId = userId;
    }

    const booking = await Booking.findOne(filter).populate(
      "userId",
      "name email phone"
    );

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    return res.json(booking);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
};
