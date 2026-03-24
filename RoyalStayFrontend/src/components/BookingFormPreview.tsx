import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Home, CreditCard, Edit, Check, User, Phone, Mail, Building, Star, Wifi, Car, Utensils, Shield, Camera, ArrowLeft, CreditCard as CardIcon } from 'lucide-react';

// Types matching your form schema
interface BookingFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  adults: number;
  children: number;
  arrivalTime: string;
  specialRequests?: string;
}

interface DateRange {
  from: Date;
  to: Date;
}

interface ApartmentDetails {
  _id: string;
  name: string;
  location: string;
  coverImage: string;
  amenities: string[];
}

interface FlatDetails {
  _id: string;
  type: 'Single' | '1BHK' | '2BHK' | '3BHK';
  title: string;
  description?: string;
  price: number;
  size?: string;
  maxOccupancy: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  features: string[];
  amenities: string[];
}

interface BookingPreviewProps {
  formData: BookingFormValues;
  dateRange: DateRange;
  apartmentDetails: ApartmentDetails;
  flatDetails: FlatDetails;
  onEdit: () => void;
  onConfirmBooking: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const BookingPreview: React.FC<BookingPreviewProps> = ({
  formData,
  dateRange,
  apartmentDetails,
  flatDetails,
  onEdit,
  onConfirmBooking,
  onCancel,
  isLoading = false
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  // Calculate booking details
  const checkInDate = dateRange.from;
  const checkOutDate = dateRange.to;
  const totalDays = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalGuests = formData.adults + formData.children;
  
  // Pricing calculations
  const basePrice = flatDetails.price;
  const subtotal = basePrice * totalDays;
  const taxes = subtotal * 0.18; // 18% GST
  const serviceFee = subtotal * 0.05; // 5% service fee
  const finalAmount = subtotal + taxes + serviceFee;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    let value = e.target.value;
    
    // Format card number with spaces
    if (field === 'number' && value.length <= 19) {
      value = value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim();
    }
    
    // Format expiry date
    if (field === 'expiry' && value.length <= 5) {
      if (value.length === 2 && !value.includes('/')) {
        value = value + '/';
      } else if (value.length === 2 && value.endsWith('/')) {
        value = value.slice(0, 1);
      }
    }
    
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 to-purple-900/40 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Booking Preview</h1>
          <p className="text-gray-300">Review your booking details before payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Card */}
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Building className="text-purple-400" />
                Property Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Property Image */}
                <div className="space-y-4">
                  <img
                    src={apartmentDetails.coverImage || '/api/placeholder/400/300'}
                    alt={apartmentDetails.name}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  
                  {/* Flat Images */}
                  {flatDetails.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {flatDetails.images.slice(0, 3).map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`${flatDetails.title} ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      ))}
                      {flatDetails.images.length > 3 && (
                        <div className="w-full h-20 bg-gray-700/50 rounded-lg flex items-center justify-center text-gray-300 text-sm">
                          +{flatDetails.images.length - 3} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Property Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{apartmentDetails.name}</h3>
                    <p className="text-gray-300 flex items-center gap-1 mt-1">
                      <MapPin className="h-4 w-4" />
                      {apartmentDetails.location}
                    </p>
                  </div>
                  
                  <div className="bg-purple-600/20 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-200 mb-2">{flatDetails.title}</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-purple-400" />
                        {flatDetails.type} • {flatDetails.size || 'Size not specified'}
                      </p>
                      <p className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-400" />
                        Up to {flatDetails.maxOccupancy} guests
                      </p>
                      <p className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-purple-400" />
                        {flatDetails.bedrooms} bed • {flatDetails.bathrooms} bath
                      </p>
                    </div>
                  </div>
                  
                  {/* Amenities */}
                  <div>
                    <h4 className="font-semibold text-white mb-2">Property Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {apartmentDetails.amenities.map((amenity, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-600/30 text-blue-200 rounded-full text-xs">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Flat Features */}
                  {flatDetails.features.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-white mb-2">Room Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {flatDetails.features.map((feature, index) => (
                          <span key={index} className="px-3 py-1 bg-green-600/30 text-green-200 rounded-full text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <User className="text-purple-400" />
                  Guest Information
                </h2>
                <button
                  onClick={onEdit}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Details
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Details */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-purple-200 mb-3">Personal Details</h3>
                  <div className="space-y-2 text-gray-300">
                    <p><span className="text-white font-medium">Name:</span> {formData.firstName} {formData.lastName}</p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {formData.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {formData.phone}
                    </p>
                  </div>
                </div>
                
                {/* Address */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-purple-200 mb-3">Address</h3>
                  <div className="space-y-2 text-gray-300">
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                  </div>
                </div>
              </div>
              
              {/* Booking Preferences */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 bg-purple-600/20 rounded-lg p-3">
                    <Users className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-white font-medium">{totalGuests} Guests</p>
                      <p className="text-gray-400 text-sm">{formData.adults} adults, {formData.children} children</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-blue-600/20 rounded-lg p-3">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">Arrival</p>
                      <p className="text-gray-400 text-sm">{formData.arrivalTime}</p>
                    </div>
                  </div>
                  
                  {formData.specialRequests && (
                    <div className="md:col-span-3 bg-green-600/20 rounded-lg p-3">
                      <p className="text-green-200 font-medium mb-1">Special Requests</p>
                      <p className="text-gray-300 text-sm">{formData.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Timeline */}
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Calendar className="text-purple-400" />
                Stay Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Check-in */}
                <div className="bg-green-600/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <h3 className="font-semibold text-green-200">Check-in</h3>
                  </div>
                  <p className="text-white font-medium">{formatDate(checkInDate)}</p>
                  <p className="text-gray-400 text-sm">After 2:00 PM</p>
                </div>
                
                {/* Check-out */}
                <div className="bg-red-600/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <h3 className="font-semibold text-red-200">Check-out</h3>
                  </div>
                  <p className="text-white font-medium">{formatDate(checkOutDate)}</p>
                  <p className="text-gray-400 text-sm">Before 11:00 AM</p>
                </div>
              </div>
              
              {/* Duration */}
              <div className="mt-4 text-center bg-purple-600/20 rounded-lg p-3">
                <p className="text-purple-200 font-medium">Total Stay Duration</p>
                <p className="text-white text-xl font-bold">{totalDays} {totalDays === 1 ? 'Night' : 'Nights'}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <CardIcon className="text-purple-400" />
                Payment Method
              </h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-lg border transition-all ${
                    paymentMethod === 'card'
                      ? 'border-purple-500 bg-purple-600/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <CreditCard className="h-6 w-6 mb-2 text-white" />
                    <span className="text-white text-sm">Credit Card</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-lg border transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-purple-500 bg-purple-600/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="h-6 w-6 mb-2 flex items-center justify-center bg-blue-500 rounded">
                      <span className="text-white font-bold text-xs">UPI</span>
                    </div>
                    <span className="text-white text-sm">UPI</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-4 rounded-lg border transition-all ${
                    paymentMethod === 'wallet'
                      ? 'border-purple-500 bg-purple-600/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="h-6 w-6 mb-2 flex items-center justify-center bg-green-500 rounded">
                      <span className="text-white font-bold text-xs">₹</span>
                    </div>
                    <span className="text-white text-sm">Wallet</span>
                  </div>
                </button>
              </div>
              
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-gray-300 mb-2">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => handleCardInputChange(e, 'number')}
                        className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                        maxLength={19}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) => handleCardInputChange(e, 'name')}
                        className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => handleCardInputChange(e, 'expiry')}
                          className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                          maxLength={5}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 mb-2">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={(e) => handleCardInputChange(e, 'cvv')}
                          className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">UPI ID</label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>
                  <p className="text-gray-400 text-sm">You'll be redirected to your UPI app to complete the payment</p>
                </div>
              )}
              
              {paymentMethod === 'wallet' && (
                <div className="space-y-4">
                  <div className="bg-purple-600/20 rounded-lg p-4">
                    <p className="text-white font-medium">Available Balance: ₹5,000</p>
                    <p className="text-gray-400 text-sm mt-1">You'll receive 5% cashback on this booking</p>
                  </div>
                  <p className="text-gray-400 text-sm">The amount will be deducted from your wallet balance</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Pricing Summary */}
          <div className="space-y-6">
            {/* Pricing Breakdown */}
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <CreditCard className="text-purple-400" />
                Price Summary
              </h2>
              
              {/* Room Rate */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Room rate</span>
                  <span className="text-white font-medium">{formatCurrency(basePrice)}/night</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">{formatCurrency(basePrice)} × {totalDays} nights</span>
                  <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
                </div>
              </div>
              
              <div className="border-t border-white/20 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Service fee (5%)</span>
                  <span className="text-white">{formatCurrency(serviceFee)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Taxes & fees (18%)</span>
                  <span className="text-white">{formatCurrency(taxes)}</span>
                </div>
              </div>
              
              <div className="border-t border-white/20 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-white">Total Amount</span>
                  <span className="text-2xl font-bold text-green-400">{formatCurrency(finalAmount)}</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">For {totalDays} nights</p>
              </div>
              
              {/* Payment Security */}
              <div className="mt-6 p-4 bg-green-600/20 rounded-lg border border-green-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span className="font-medium text-green-200">Secure Payment</span>
                </div>
                <p className="text-green-300 text-sm">
                  Your payment is processed securely through Razorpay with 256-bit SSL encryption.
                </p>
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Booking Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Property</span>
                  <span className="text-white font-medium text-right">{apartmentDetails.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Room Type</span>
                  <span className="text-purple-300 font-medium">{flatDetails.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Guests</span>
                  <span className="text-white font-medium">{totalGuests} guests</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Duration</span>
                  <span className="text-white font-medium">{totalDays} nights</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Confirmation Section */}
        <div className="mt-8 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Check className="h-6 w-6 text-green-400" />
            <h2 className="text-xl font-bold text-white">Ready to Confirm</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Booking Policies */}
            <div className="space-y-3">
              <h3 className="font-semibold text-purple-200">Booking Policies</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  Free cancellation up to 24 hours before check-in
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  Check-in: After 2:00 PM • Check-out: Before 11:00 AM
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  Valid government ID required at check-in
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  No smoking policy strictly enforced
                </li>
              </ul>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-purple-200">Your Information</h3>
              <div className="bg-gray-800/30 rounded-lg p-4 space-y-2 text-sm">
                <p className="text-white font-medium">{formData.firstName} {formData.lastName}</p>
                <p className="text-gray-300">{formData.email}</p>
                <p className="text-gray-300">{formData.phone}</p>
                <p className="text-gray-400 text-xs mt-2">
                  {formData.address}, {formData.city}, {formData.state} {formData.zipCode}
                </p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/20">
            <button
              onClick={onEdit}
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Booking Details
            </button>
            
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel Booking
              </button>
            )}
            
            <button
              onClick={onConfirmBooking}
              disabled={isLoading}
              className="flex-1 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Proceed to Payment • {formatCurrency(finalAmount)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPreview;