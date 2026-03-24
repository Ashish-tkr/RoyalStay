// =============================================================================
// BOOKING SCHEMA MODEL
// =============================================================================

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // User Information (from JWT)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Property References
    apartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Apartment", 
      required: true,
    },
    flatId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // Reference to flat within apartment.flats array
    },
    
    // Denormalized Apartment/Flat Details (for quick access)
    apartmentDetails: {
      name: { type: String, required: true },
      location: { type: String, required: true },
      coverImage: { type: String },
    },
    flatDetails: {
      type: { type: String, enum: ["Single", "1BHK", "2BHK", "3BHK"], required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true }, // rent per month/day
      size: { type: String },
      maxOccupancy: { type: Number, required: true },
      bedrooms: { type: Number, required: true },
      bathrooms: { type: Number, required: true },
      images: [{ type: String }],
      features: [{ type: String }],
      amenities: [{ type: String }],
    },
    
    // Guest Information (from your form)
    guestInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    
    // Booking Details
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    adults: { type: Number, required: true, min: 1, max: 10 },
    children: { type: Number, default: 0, min: 0, max: 10 },
    totalGuests: { type: Number, required: true }, // adults + children
    arrivalTime: { type: String, required: true },
    specialRequests: { type: String },
    
    // Booking Status
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    
    // Payment Information
    payment: {
      amount: { type: Number, required: true }, // total amount
      currency: { type: String, default: "INR" },
      paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded", "partial"],
        default: "pending",
      },
      paymentMethod: { type: String }, // "razorpay", "card", "upi", etc.
      razorpay_payment_id: { type: String }, // from Razorpay
      razorpay_order_id: { type: String }, // from Razorpay
      razorpay_signature: { type: String }, // from Razorpay
      paidAt: { type: Date }, // from payment verification
      // Razorpay Integration
      razorpayOrderId: { type: String }, // from razorpay.orders.create()
      razorpayPaymentId: { type: String }, // from payment verification
      razorpaySignature: { type: String }, // for payment verification
      transactionId: { type: String }, // unique transaction reference
      
      // Payment tracking
      paidAt: { type: Date },
      refundedAt: { type: Date },
      refundAmount: { type: Number, default: 0 },
      refundReason: { type: String },
    },
    
    // Booking Calculations
    pricing: {
      basePrice: { type: Number, required: true }, // per day/month rate
      totalDays: { type: Number, required: true },
      subtotal: { type: Number, required: true },
      taxes: { type: Number, default: 0 },
      serviceFee: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      finalAmount: { type: Number, required: true },
    },
    
    // Admin Notes
    adminNotes: { type: String },
    
    // Cancellation
    cancellation: {
      cancelledAt: { type: Date },
      cancelledBy: { type: String }, // "user" or "admin"
      cancellationReason: { type: String },
      refundEligible: { type: Boolean, default: false },
    },
  },
  { 
    timestamps: true, // Auto createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for booking duration
bookingSchema.virtual('duration').get(function() {
  const diffTime = this.checkOutDate - this.checkInDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // days
});

// Pre-save middleware to calculate totals
bookingSchema.pre('save', function(next) {
  // Calculate total guests
  this.totalGuests = this.adults + this.children;
  
  // Calculate pricing if not set
  if (!this.pricing.totalDays) {
    const diffTime = this.checkOutDate - this.checkInDate;
    this.pricing.totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  if (!this.pricing.subtotal) {
    this.pricing.subtotal = this.pricing.basePrice * this.pricing.totalDays;
  }
  
  if (!this.pricing.finalAmount) {
    this.pricing.finalAmount = this.pricing.subtotal + this.pricing.taxes + this.pricing.serviceFee - this.pricing.discount;
  }
  
  // Sync payment amount with final amount
  this.payment.amount = this.pricing.finalAmount;
  
  next();
});

// Indexes for performance
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ apartmentId: 1, flatId: 1 });
bookingSchema.index({ checkInDate: 1, checkOutDate: 1 });
bookingSchema.index({ 'payment.paymentStatus': 1 });
bookingSchema.index({ 'payment.razorpayOrderId': 1 });
bookingSchema.index({ createdAt: -1 });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;