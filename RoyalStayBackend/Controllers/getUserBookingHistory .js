// controllers/bookingController.js
import Booking from "../models/booking.js";

/**
 * Get user booking history with filtering by status and date sorting
 * @route GET /api/bookings/history
 * @param {string} status - Filter by status: 'active', 'completed', 'cancelled', or 'all'
 * @param {string} sort - Sort by: 'dateAsc', 'dateDesc' (default: dateDesc)
 * @returns {Array} List of bookings
 */
export const getUserBookingHistory = async (req, res) => {
  try {
    const { status = 'all', sort = 'dateDesc' } = req.query;
    const userId = req.user._id; // Assuming user is authenticated and user object is attached

    // Build filter object
    let filter = { userId };
    
    // Handle status filtering
    if (status !== 'all') {
      if (status === 'active') {
        // Active bookings: confirmed status AND check-out date is in future
        filter.status = 'confirmed';
        filter.checkOutDate = { $gte: new Date() };
      } else if (status === 'upcoming') {
        // Upcoming bookings: confirmed status AND check-in date is in future
        filter.status = 'confirmed';
        filter.checkInDate = { $gte: new Date() };
      } else if (status === 'past') {
        // Past bookings: completed OR (confirmed AND check-out date passed)
        filter.$or = [
          { status: 'completed' },
          { 
            status: 'confirmed',
            checkOutDate: { $lt: new Date() }
          }
        ];
      } else {
        // Specific status (confirmed, pending, cancelled, completed)
        filter.status = status;
      }
    }

    // Build sort object
    let sortOptions = {};
    switch (sort) {
      case 'dateAsc':
        sortOptions = { checkInDate: 1 };
        break;
      case 'dateDesc':
        sortOptions = { checkInDate: -1 };
        break;
      case 'createdAsc':
        sortOptions = { createdAt: 1 };
        break;
      case 'createdDesc':
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { checkInDate: -1 };
    }

    // Fetch bookings with populated data
    const bookings = await Booking.find(filter)
      .populate('apartmentId', 'name location images') // Populate apartment details
      .populate('flatId', 'type title price') // Populate flat details
      .sort(sortOptions)
      .lean();

    // Enhance bookings with additional status information
    const enhancedBookings = bookings.map(booking => {
      const now = new Date();
      const isUpcoming = booking.checkInDate > now;
      const isActive = booking.status === 'confirmed' && 
                       booking.checkInDate <= now && 
                       booking.checkOutDate >= now;
      const isPast = booking.status === 'completed' || 
                    (booking.status === 'confirmed' && booking.checkOutDate < now);

      return {
        ...booking,
        bookingStatus: {
          isUpcoming,
          isActive,
          isPast,
          isCancelled: booking.status === 'cancelled',
          isPending: booking.status === 'pending'
        }
      };
    });

    res.status(200).json({
      success: true,
      count: enhancedBookings.length,
      data: enhancedBookings
    });

  } catch (error) {
    console.error('Booking history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking history',
      error: error.message
    });
  }
};

/**
 * Get booking by ID (for detailed view)
 */
export const GetBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findOne({ _id: id, userId })
      .populate('apartmentId', 'name location amenities contactInfo')
      .populate('flatId', 'type title price images features amenities');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking details',
      error: error.message
    });
  }
};

/**
 * Get active bookings (check-out date is in future)
 * @route GET /api/bookings/active
 */
export const getActiveBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const activeBookings = await Booking.find({
      userId,
      checkOutDate: { $gte: now } // Check-out date is in future
    })
      .populate('apartmentId', 'name location coverImage')
      .populate('flatId', 'type title price images')
      .sort({ checkInDate: 1 }) // Sort by check-in date ascending
      .lean();

    // Enhance with status info
    const enhancedBookings = activeBookings.map(booking => ({
      ...booking,
      bookingStatus: {
        isActive: true,
        isUpcoming: booking.checkInDate > now,
        isPast: false,
        isCancelled: false,
        isPending: false
      }
    }));

    res.status(200).json({
      success: true,
      count: enhancedBookings.length,
      data: enhancedBookings
    });

  } catch (error) {
    console.error('Active bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active bookings',
      error: error.message
    });
  }
};

/**
 * Get inactive bookings (check-out date has passed or cancelled/completed)
 * @route GET /api/bookings/inactive
 */
export const getInactiveBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const inactiveBookings = await Booking.find({
      userId,
      $or: [
        // Check-out date has passed
        { 
          status: 'confirmed',
          checkOutDate: { $lt: now }
        },
        // Cancelled bookings
        { status: 'cancelled' },
        // Completed bookings
        { status: 'completed' }
      ]
    })
      .populate('apartmentId', 'name location coverImage')
      .populate('flatId', 'type title price images')
      .sort({ checkOutDate: -1 }) // Sort by check-out date descending (most recent first)
      .lean();

    // Enhance with status info
    const enhancedBookings = inactiveBookings.map(booking => {
      const isPast = booking.status === 'confirmed' && booking.checkOutDate < now;
      
      return {
        ...booking,
        bookingStatus: {
          isActive: false,
          isUpcoming: false,
          isPast: isPast,
          isCancelled: booking.status === 'cancelled',
          isCompleted: booking.status === 'completed',
          isPending: false
        }
      };
    });

    res.status(200).json({
      success: true,
      count: enhancedBookings.length,
      data: enhancedBookings
    });

  } catch (error) {
    console.error('Inactive bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inactive bookings',
      error: error.message
    });
  }
};

/**
 * Get upcoming bookings (check-in date is in future)
 * @route GET /api/bookings/upcoming
 */
export const getUpcomingBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const upcomingBookings = await Booking.find({
      userId,
      status: 'confirmed',
      checkInDate: { $gt: now } // Check-in date is in future
    })
      .populate('apartmentId', 'name location coverImage')
      .populate('flatId', 'type title price images')
      .sort({ checkInDate: 1 }) // Sort by check-in date ascending
      .lean();

    // Enhance with status info
    const enhancedBookings = upcomingBookings.map(booking => ({
      ...booking,
      bookingStatus: {
        isActive: false,
        isUpcoming: true,
        isPast: false,
        isCancelled: false,
        isPending: false
      }
    }));

    res.status(200).json({
      success: true,
      count: enhancedBookings.length,
      data: enhancedBookings
    });

  } catch (error) {
    console.error('Upcoming bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming bookings',
      error: error.message
    });
  }
};

/**
 * Get past bookings (check-out date has passed but status is confirmed)
 * @route GET /api/bookings/past
 */
export const getPastBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const pastBookings = await Booking.find({
      userId,
      status: 'confirmed',
      checkOutDate: { $lt: now } // Check-out date has passed
    })
      .populate('apartmentId', 'name location coverImage')
      .populate('flatId', 'type title price images')
      .sort({ checkOutDate: -1 }) // Sort by check-out date descending
      .lean();

    // Enhance with status info
    const enhancedBookings = pastBookings.map(booking => ({
      ...booking,
      bookingStatus: {
        isActive: false,
        isUpcoming: false,
        isPast: true,
        isCancelled: false,
        isPending: false
      }
    }));

    res.status(200).json({
      success: true,
      count: enhancedBookings.length,
      data: enhancedBookings
    });

  } catch (error) {
    console.error('Past bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching past bookings',
      error: error.message
    });
  }
};