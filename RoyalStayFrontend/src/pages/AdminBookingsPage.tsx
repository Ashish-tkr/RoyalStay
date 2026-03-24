import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Users, 
  Clock, 
  Star,
  X,
  Mail,
  Phone,
  Home,
  Bed,
  Bath,
  Square,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2
} from 'lucide-react';

// Types
interface UserDetails {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  picture?: string;
  subscribeNewsletter: boolean;
  createdAt: string;
}

interface Booking {
  _id: string;
  apartmentDetails: {
    name: string;
    location: string;
    coverImage: string;
  };
  flatDetails: {
    type: string;
    title: string;
    price: number;
    size: string;
    maxOccupancy: number;
    bedrooms: number;
    bathrooms: number;
    images: string[];
    features: string[];
    amenities: string[];
  };
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  payment: {
    amount: number;
    currency: string;
    paymentStatus: string;
    paidAt?: string;
    razorpayOrderId: string;
    transactionId: string;
  };
  pricing: {
    basePrice: number;
    totalDays: number;
    subtotal: number;
    taxes: number;
    serviceFee: number;
    discount: number;
    finalAmount: number;
  };
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  totalGuests: number;
  arrivalTime: string;
  specialRequests: string;
  status: string;
  createdAt: string;
  duration: number;
}

interface UserBookingData {
  userDetails: UserDetails;
  bookings: Booking[];
}

interface ApiResponse {
  success: boolean;
  totalUsers: number;
  data: UserBookingData[];
}

const AdminBookingsPage: React.FC = () => {
  const [bookingsData, setBookingsData] = useState<UserBookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/bookings/admin/details', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      if (data.success) {
        setBookingsData(data.data);
      } else {
        throw new Error('Failed to fetch bookings');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-8 h-8 animate-spin text-royal-400" />
          <span className="text-white text-xl">Loading bookings...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Bookings</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="bg-royal-600 hover:bg-royal-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white">
      {/* Header */}
      <div className="bg-royal-800 p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white">Booking Management</h1>
        <p className="text-royal-200 mt-2">
          Total Users: {bookingsData.length} | 
          Total Bookings: {bookingsData.reduce((acc, user) => acc + user.bookings.length, 0)}
        </p>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {bookingsData.map((userData, index) => (
          <div
            key={userData.userDetails._id}
            className="bg-royal-800/30 border border-royal-700/50 rounded-xl p-6 hover:bg-royal-800/40 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto   ">
              {/* User Details Section */}
              <div className="lg:w-80 flex-shrink-0">
                <div className="bg-black/40 rounded-lg p-4 h-full">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-royal-600 rounded-full flex items-center justify-center overflow-hidden">
                      {userData.userDetails.avatar || userData.userDetails.picture ? (
                        <img 
                          src={userData.userDetails.avatar || userData.userDetails.picture} 
                          alt={userData.userDetails.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {userData.userDetails.name}
                      </h3>
                      <p className="text-royal-300 text-sm">
                        Member since {formatDate(userData.userDetails.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-royal-400" />
                      <span className="text-gray-300 text-sm">{userData.userDetails.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <div className={`w-2 h-2 rounded-full ${userData.userDetails.subscribeNewsletter ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      </div>
                      <span className="text-gray-300 text-sm">
                        Newsletter: {userData.userDetails.subscribeNewsletter ? 'Subscribed' : 'Not subscribed'}
                      </span>
                    </div>
                    <div className="mt-4 p-3 bg-royal-900/50 rounded-lg">
                      <p className="text-royal-200 text-sm font-medium">
                        Total Bookings: {userData.bookings.length}
                      </p>
                      <p className="text-royal-200 text-sm">
                        Total Spent: {formatCurrency(
                          userData.bookings.reduce((sum, booking) => sum + booking.payment.amount, 0)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bookings Horizontal Scroll Section */}
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-royal-400" />
                  Recent Bookings ({userData.bookings.length})
                </h4>
                
                <div className="overflow-x-auto">
                  <div className="flex space-x-4 pb-4 min-w-max">
                    {userData.bookings.map((booking) => (
                      <div
                        key={booking._id}
                        onClick={() => setSelectedBooking(booking)}
                        className="bg-black/60 border border-royal-700/30 rounded-lg p-4 min-w-80 cursor-pointer hover:bg-black/80 hover:border-royal-500 transition-all duration-300 group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-2">
                            <Home className="w-4 h-4 text-royal-400" />
                            <h5 className="text-white font-semibold text-sm">
                              {booking.apartmentDetails.name}
                            </h5>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs border flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span>{booking.status}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-3 h-3 text-royal-400" />
                            <span className="text-gray-300 text-xs">{booking.apartmentDetails.location}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Bed className="w-3 h-3 text-royal-400" />
                            <span className="text-gray-300 text-xs">{booking.flatDetails.type}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Users className="w-3 h-3 text-royal-400" />
                              <span className="text-gray-300 text-xs">{booking.totalGuests} guests</span>
                            </div>
                            <div className="text-royal-300 text-xs">
                              {booking.duration} {booking.duration === 1 ? 'night' : 'nights'}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-royal-700/30">
                            <span className="text-gray-400 text-xs">
                              {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                            </span>
                            <span className="text-white font-bold text-sm">
                              {formatCurrency(booking.payment.amount)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-royal-300 group-hover:text-royal-200 transition-colors">
                          Click for details →
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-royal-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-royal-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Booking Details</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Property Details */}
              <div className="bg-black/40 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Home className="w-5 h-5 mr-2 text-royal-400" />
                  Property Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-royal-300 text-sm">Property Name</p>
                    <p className="text-white font-medium">{selectedBooking.apartmentDetails.name}</p>
                  </div>
                  <div>
                    <p className="text-royal-300 text-sm">Location</p>
                    <p className="text-white font-medium">{selectedBooking.apartmentDetails.location}</p>
                  </div>
                  <div>
                    <p className="text-royal-300 text-sm">Room Type</p>
                    <p className="text-white font-medium">{selectedBooking.flatDetails.type}</p>
                  </div>
                  <div>
                    <p className="text-royal-300 text-sm">Room Title</p>
                    <p className="text-white font-medium">{selectedBooking.flatDetails.title}</p>
                  </div>
                </div>
              </div>

              {/* Room Details */}
              <div className="bg-black/40 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Bed className="w-5 h-5 mr-2 text-royal-400" />
                  Room Specifications
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Square className="w-6 h-6 mx-auto mb-2 text-royal-400" />
                    <p className="text-royal-300 text-sm">Size</p>
                    <p className="text-white font-medium">{selectedBooking.flatDetails.size} sq ft</p>
                  </div>
                  <div className="text-center">
                    <Bed className="w-6 h-6 mx-auto mb-2 text-royal-400" />
                    <p className="text-royal-300 text-sm">Bedrooms</p>
                    <p className="text-white font-medium">{selectedBooking.flatDetails.bedrooms}</p>
                  </div>
                  <div className="text-center">
                    <Bath className="w-6 h-6 mx-auto mb-2 text-royal-400" />
                    <p className="text-royal-300 text-sm">Bathrooms</p>
                    <p className="text-white font-medium">{selectedBooking.flatDetails.bathrooms}</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-royal-400" />
                    <p className="text-royal-300 text-sm">Max Occupancy</p>
                    <p className="text-white font-medium">{selectedBooking.flatDetails.maxOccupancy}</p>
                  </div>
                </div>
              </div>

              {/* Guest Information */}
              <div className="bg-black/40 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-royal-400" />
                  Guest Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-royal-300 text-sm">Guest Name</p>
                    <p className="text-white font-medium">
                      {selectedBooking.guestInfo.firstName} {selectedBooking.guestInfo.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-royal-300 text-sm">Email</p>
                    <p className="text-white font-medium">{selectedBooking.guestInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-royal-300 text-sm">Phone</p>
                    <p className="text-white font-medium">{selectedBooking.guestInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-royal-300 text-sm">Arrival Time</p>
                    <p className="text-white font-medium">{selectedBooking.arrivalTime}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-royal-300 text-sm">Address</p>
                    <p className="text-white font-medium">
                      {selectedBooking.guestInfo.address}, {selectedBooking.guestInfo.city}, {selectedBooking.guestInfo.state} - {selectedBooking.guestInfo.zipCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-black/40 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-royal-400" />
                  Booking Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-royal-300 text-sm">Check-in Date</p>
                    <p className="text-white font-medium">{formatDate(selectedBooking.checkInDate)}</p>
                  </div>
                  <div>
                    <p className="text-royal-300 text-sm">Check-out Date</p>
                    <p className="text-white font-medium">{formatDate(selectedBooking.checkOutDate)}</p>
                  </div>
                  <div>
                    <p className="text-royal-300 text-sm">Duration</p>
                    <p className="text-white font-medium">{selectedBooking.duration} nights</p>
                  </div>
                  <div>
                    <p className="text-royal-300 text-sm">Adults</p>
                    <p className="text-white font-medium">{selectedBooking.adults}</p>
                  </div>
                  <div>
                    <p className="text-royal-300 text-sm">Children</p>
                    <p className="text-white font-medium">{selectedBooking.children}</p>
                  </div>
                  <div>
                    <p className="text-royal-300 text-sm">Total Guests</p>
                    <p className="text-white font-medium">{selectedBooking.totalGuests}</p>
                  </div>
                </div>
                {selectedBooking.specialRequests && (
                  <div className="mt-4">
                    <p className="text-royal-300 text-sm">Special Requests</p>
                    <p className="text-white font-medium">{selectedBooking.specialRequests}</p>
                  </div>
                )}
              </div>

              {/* Payment Information */}
              <div className="bg-black/40 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-royal-400" />
                  Payment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-royal-300 text-sm">Base Price</p>
                    <p className="text-white font-medium">{formatCurrency(selectedBooking.pricing.basePrice)} × {selectedBooking.pricing.totalDays} days</p>
                  </div>
                  <div>
                    <p className="text-royal-300 text-sm">Subtotal</p>
                    <p className="text-white font-medium">{formatCurrency(selectedBooking.pricing.subtotal)}</p>
                  </div>
                  <div>
                    <p className="text-royal-300 text-sm">Taxes</p>
                    <p className="text-white font-medium">{formatCurrency(selectedBooking.pricing.taxes)}</p>
                  </div>
                  <div>
                    <p className="text-royal-300 text-sm">Service Fee</p>
                    <p className="text-white font-medium">{formatCurrency(selectedBooking.pricing.serviceFee)}</p>
                  </div>
                  <div className="md:col-span-2 border-t border-royal-700 pt-2">
                    <p className="text-royal-300 text-sm">Final Amount</p>
                    <p className="text-white font-bold text-xl">{formatCurrency(selectedBooking.pricing.finalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-royal-300 text-sm">Payment Status</p>
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(selectedBooking.payment.paymentStatus)}`}>
                      {getStatusIcon(selectedBooking.payment.paymentStatus)}
                      <span>{selectedBooking.payment.paymentStatus}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-royal-300 text-sm">Transaction ID</p>
                    <p className="text-white font-medium text-sm">{selectedBooking.payment.transactionId}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingsPage;