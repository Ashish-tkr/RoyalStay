import React, { useState, useEffect } from 'react';
import { User, Calendar, MapPin, CreditCard, Phone, Mail, Clock, Users, Bed, Bath, Star, History, CheckCircle, XCircle } from 'lucide-react';

interface UserData {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  subscribeNewsletter: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BookingData {
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
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  totalGuests: number;
  arrivalTime: string;
  status: string;
  payment: {
    amount: number;
    currency: string;
    paymentStatus: string;
    paidAt: string;
  };
  pricing: {
    basePrice: number;
    totalDays: number;
    subtotal: number;
    taxes: number;
    serviceFee: number;
    finalAmount: number;
  };
  bookingStatus: {
    isActive: boolean;
    isUpcoming: boolean;
    isPast: boolean;
    isCancelled: boolean;
  };
  createdAt: string;
}

const MyBooking: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [activeBookings, setActiveBookings] = useState<BookingData[]>([]);
  const [inactiveBookings, setInactiveBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Mock user data based on provided response

useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/user", {
        credentials: "include", // if using cookies/session
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user); // assuming backend sends { success: true, user: {...} }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
  fetchActiveBookings(); // load bookings
}, []);


  const fetchActiveBookings = async () => {
    setBookingsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/bookings/active', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setActiveBookings(data.data);
      }
    } catch (error) {
      console.error('Error fetching active bookings:', error);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchInactiveBookings = async () => { 
    setBookingsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/bookings/inactive', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setInactiveBookings(data.data);
      }
    } catch (error) {
      console.error('Error fetching inactive bookings:', error);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleShowHistory = () => {
    if (!showHistory) {
      fetchInactiveBookings();
    }
    setShowHistory(!showHistory);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'text-green-400 bg-green-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const currentBookings = showHistory ? inactiveBookings : activeBookings;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* User Profile Section */}
        <div className="mb-8">
          <div className="luxury-800/80 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-purple-900/40 p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={user?.avatar || "/images/dummy-avatar.png"}
                    alt={user?.name}
                    className="w-24 h-24 rounded-full border-4 border-white/20 shadow-2xl"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-black flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                    {user?.name}
                  </h1>
                  <div className="flex flex-col md:flex-row gap-4 text-gray-300">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Mail className="w-4 h-4" />
                      <span>{user?.email}</span>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="luxury-800/80 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
          {/* Section Header */}
          <div className="bg-gradient-to-r from-gray-900/40 to-gray-800/40 p-6 border-b border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {showHistory ? 'Booking History' : 'Active Bookings'}
              </h2>
              <button
                onClick={handleShowHistory}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                <History className="w-4 h-4" />
                <span>{showHistory ? 'Show Active' : 'Show History'}</span>
              </button>
            </div>
          </div>

          {/* Bookings Content */}
          <div className="p-6">
            {bookingsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : currentBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No {showHistory ? 'past' : 'active'} bookings
                </h3>
                <p className="text-gray-500">
                  {showHistory 
                    ? "You don't have any completed bookings yet." 
                    : "You don't have any active bookings at the moment."
                  }
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {currentBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-gradient-to-r from-gray-900/60 to-gray-800/60 rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Property Image */}
                      <div className="lg:w-80 h-48 lg:h-auto relative">
                        <img
                          src={booking.apartmentDetails.coverImage}
                          alt={booking.apartmentDetails.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                            {booking.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1 p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Left Column */}
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">
                              {booking.apartmentDetails.name}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-400 mb-4">
                              <MapPin className="w-4 h-4" />
                              <span>{booking.apartmentDetails.location}</span>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-gray-300">
                                <Calendar className="w-4 h-4 text-purple-400" />
                                <span className="text-sm">
                                  {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-gray-300">
                                <Users className="w-4 h-4 text-blue-400" />
                                <span className="text-sm">
                                  {booking.adults} Adults, {booking.children} Children
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-gray-300">
                                <Clock className="w-4 h-4 text-green-400" />
                                <span className="text-sm">{booking.arrivalTime}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Column */}
                          <div>
                            <div className="mb-4">
                              <h4 className="text-lg font-semibold text-white mb-2">
                                {booking.flatDetails.type}
                              </h4>
                              <div className="flex gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Bed className="w-4 h-4" />
                                  <span>{booking.flatDetails.bedrooms}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Bath className="w-4 h-4" />
                                  <span>{booking.flatDetails.bathrooms}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>Max {booking.flatDetails.maxOccupancy}</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Base Price:</span>
                                <span className="text-white">{formatCurrency(booking.pricing.basePrice, booking.payment.currency)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Taxes & Fees:</span>
                                <span className="text-white">{formatCurrency(booking.pricing.taxes + booking.pricing.serviceFee, booking.payment.currency)}</span>
                              </div>
                              <div className="flex justify-between font-semibold border-t border-white/10 pt-2">
                                <span className="text-white">{booking.status.toLowerCase() === "pending" ? "Pending Amount:" : "Total Paid:"}</span>
                                <span className={booking.status.toLocaleLowerCase()=== "pending" ? "text-yellow-400" : "text-green-400"}> 
                                  {formatCurrency(booking.payment.amount, booking.payment.currency)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Guest Info */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                          <h5 className="text-sm font-semibold text-gray-300 mb-3">Guest Information</h5>
                          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
                            <div>
                              <span className="font-medium">Name:</span> {booking.guestInfo.firstName} {booking.guestInfo.lastName}
                            </div>
                            <div>
                              <span className="font-medium">Phone:</span> {booking.guestInfo.phone}
                            </div>
                            <div className="md:col-span-2">
                              <span className="font-medium">Address:</span> {booking.guestInfo.address}, {booking.guestInfo.city}, {booking.guestInfo.state} {booking.guestInfo.zipCode}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBooking;