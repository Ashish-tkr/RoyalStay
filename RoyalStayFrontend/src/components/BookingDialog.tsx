import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { BookingForm, BookingFormValues } from './BookingForm';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Check, Loader2 } from 'lucide-react';
import { useBooking } from '@/hooks/use-booking';
import { useState, useEffect } from 'react';

// Define the types for apartment and flat
interface FlatType {
  _id?: string;
  type: "Single" | "1BHK" | "2BHK" | "3BHK";
  title: string;
  description?: string;
  price: number;
  baseprice?: number;
  size?: string;
  maxOccupancy?: number;
  bedrooms?: number;
  bathrooms?: number;
  images: string[];
  features: string[];
  amenities: string[];
  rating?: number;
  reviews?: number;
}

interface Apartment {
  _id?: string;
  name: string;
  location: string;
  coverImage: string;
  amenities: string[];
  flats: FlatType[];
  rating: number;
  reviews: number;
  hasRestaurant: boolean;
  hasGym: boolean;
  hasPool?: boolean;
  hasSpa?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  __v: number;
  minPrice?: number;
  minBasePrice?: number;
  cheapestFlat?: FlatType;
}

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyName?: string;
  propertyImage?: string;
  initialDateRange?: DateRange;
  apartment?: Apartment | null;
  flat?: FlatType | null;
}

// Extend Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

export function BookingDialog({
  open,
  onOpenChange,
  propertyName = "Property",
  propertyImage,
  initialDateRange,
  apartment,
  flat
}: BookingDialogProps) {
  const { currentStep, setStep, bookingData, setBookingData, selectedRoom ,openBooking } = useBooking();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [finalBookingResult, setFinalBookingResult] = useState<any>(null);
  
  // Form data state - stores form data before payment
  const [formData, setFormData] = useState<(BookingFormValues & { dateRange: DateRange | undefined }) | null>(null);

  // Load Razorpay script
  useEffect(() => {
    if (open) {
      console.log('BookingDialog opened with props:', {
        apartment: apartment ? {_id: apartment._id, name: apartment.name} : null,
        flat: flat ? {_id: flat._id, title: flat.title, type: flat.type} : null,
        hasApartmentId: !!apartment?._id,
        hasFlatId: !!flat?._id
      });
    }
  }, [open, apartment, flat]);

  useEffect(() => {
    
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    if (open && currentStep === 'confirmation') {
      loadRazorpay();
    }
  }, [open, currentStep]);

  // Handle form submission - just store data and show confirmation
  const handleFormSubmit = (data: BookingFormValues & { dateRange: DateRange | undefined }) => {
    setFormData(data);
    
    // Convert form data to BookingData format for display
    const bookingInfo = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      checkIn: data.dateRange?.from || new Date(),
      checkOut: data.dateRange?.to || new Date(),
      adults: data.adults,
      children: data.children,
      arrivalTime: data.arrivalTime,
      specialRequests: data.specialRequests,
    };

    setBookingData(bookingInfo);
    setStep('confirmation');
  };

  // Handle actual booking creation after successful payment
  const handleBookingCreation = async (paymentData: any) => {
    if (!formData) {
      throw new Error('Form data not found');
    }

    try {
      // Prepare data for API call
      const bookingPayload = {
        apartmentId: apartment?._id,
        flatId: flat?._id || flat?.type,
        guestInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        checkInDate: formData.dateRange?.from?.toISOString(),
        checkOutDate: formData.dateRange?.to?.toISOString(),
        adults: formData.adults,
        children: formData.children,
        arrivalTime: formData.arrivalTime,
        specialRequests: formData.specialRequests,
        paymentDetails: paymentData, // Include payment information
      };

      // Call the booking API
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      const result = await response.json();
      setFinalBookingResult(result);
      return result;

    } catch (error) {
      console.error('Booking creation error:', error);
      throw error;
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setBookingError(null);
    setFinalBookingResult(null);
    setFormData(null);
  };

  const handleNewBooking = () => {
    setStep('form');
    setBookingError(null);
    setFinalBookingResult(null);
    setFormData(null);
  };

  // Replace your handleProceedToPayment function with this:
  const handleProceedToPayment = async (e: React.MouseEvent) => {
    e.preventDefault();
    // Validate required data first
    if (!apartment?._id) {
      alert('Apartment information is missing. Please try again.');
      return;
    }
    
    if (!flat?._id) {
      alert('Flat information is missing. Please try again.');
      return;
    }
    
    if (!formData) {
      alert('Please fill in all required details.');
      return;
    }

    setIsProcessingPayment(true);
    
    try {
      // Calculate pricing
      const checkIn = new Date(formData.dateRange?.from || new Date());
      const checkOut = new Date(formData.dateRange?.to || new Date());
      const msPerDay = 1000 * 60 * 60 * 24;
      const totalDays = Math.ceil((checkOut.getTime() - checkIn.getTime()) / msPerDay);
      
      const basePrice = flat?.price || 0;
      const subtotal = basePrice * totalDays;
      const taxes = +(subtotal * 0.18).toFixed(2);
      const serviceFee = +(subtotal * 0.05).toFixed(2);
      const finalAmount = +(subtotal + taxes + serviceFee).toFixed(2);

      console.log('Creating booking with amount:', finalAmount);
      console.log('Apartment ID:', apartment?._id);
      console.log('Flat ID:', flat?._id);

      // Create booking first (this will create Razorpay order)
      const bookingResponse = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apartmentId: apartment._id,
          flatId: flat._id,
          guestInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
          },
          checkInDate: formData.dateRange?.from?.toISOString(),
          checkOutDate: formData.dateRange?.to?.toISOString(),
          adults: formData.adults,
          children: formData.children,
          arrivalTime: formData.arrivalTime,
          specialRequests: formData.specialRequests,
        }),
      });

      // Check if response is OK first
      if (!bookingResponse.ok) {
        const errorText = await bookingResponse.text();
        console.error('Booking creation failed:', errorText);
        throw new Error(`Server error: ${bookingResponse.status}`);
      }

      const bookingData = await bookingResponse.json();
      
      console.log('Booking creation response:', bookingData);
      
      if (!bookingData.success) {
        throw new Error(bookingData.message || 'Failed to create booking');
      }

      if (!bookingData.razorpayOrder) {
        throw new Error('Razorpay order not created');
      }

      // Store booking ID and Razorpay order for verification
      const bookingId = bookingData.booking._id;
      const razorpayOrder = bookingData.razorpayOrder;

      // Close the React dialog first
      onOpenChange(false);
      
      // Small delay to ensure dialog is closed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if Razorpay script is loaded
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please refresh the page and try again.');
      }

      const options = {
        key: "rzp_test_R7ZqOGfAkqHgIQ",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Luxury Apartments",
        description: `Booking for ${propertyName} - ${flat?.title}`,
        image: "/logo.svg",
        order_id: razorpayOrder.id,
        handler: function (response: any) {
          console.log('Payment successful:', response);
          handlePaymentSuccess(response, bookingId, razorpayOrder.id);
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          property: propertyName,
          flat_type: flat?.type,
          check_in: formData.dateRange?.from?.toISOString(),
          check_out: formData.dateRange?.to?.toISOString(),
          apartment_id: apartment._id,
          flat_id: flat._id,
          booking_id: bookingId
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed');
            setIsProcessingPayment(false);
            onOpenChange(true);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        let errorMessage = 'Payment failed. Please try again.';
        
        if (response.error && response.error.description) {
          errorMessage = `Payment failed: ${response.error.description}`;
        }
        
        alert(errorMessage);
        setIsProcessingPayment(false);
        onOpenChange(true);
      });

      // Open Razorpay checkout
      rzp.open();
      
    } catch (error) {
      console.error('Error in payment handler:', error);
      alert(error.message || 'Something went wrong. Please try again.');
      setIsProcessingPayment(false);
      onOpenChange(true);
    }
  };

  const handlePaymentSuccess = async (paymentResponse: any, bookingId: string, razorpayOrderId: string) => {
    try {
      // Verify payment with your backend
      const verifyResponse = await fetch("http://localhost:5000/api/bookings/verify-payment", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify({
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_order_id: razorpayOrderId,
          razorpay_signature: paymentResponse.razorpay_signature,
          bookingId: bookingId,
          apartmentId: apartment?._id,
          flatId: flat?._id,
        }),
      });
      
      const result = await verifyResponse.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Payment verification failed');
      }
      
      setIsProcessingPayment(false);
      alert('Payment successful! Your booking has been confirmed.');
      
    } catch (error) {
      console.error('Error verifying payment:', error);
      setIsProcessingPayment(false);
      alert('Payment was successful, but there was an issue verifying it. Please contact support.');
    }
  };

  // Function to verify payment on backend


  // Calculate pricing details if we have flat data
  const calculatePricing = () => {
    if (!flat || !bookingData?.checkIn || !bookingData?.checkOut) return null;

    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const msPerDay = 1000 * 60 * 60 * 24;
    const totalDays = Math.ceil((checkOut.getTime() - checkIn.getTime()) / msPerDay);

    const basePrice = flat.price;
    const subtotal = basePrice * totalDays;
    const taxes = +(subtotal * 0.18).toFixed(2); // 18% GST
    const serviceFee = +(subtotal * 0.05).toFixed(2); // 5% service fee
    const finalAmount = +(subtotal + taxes + serviceFee).toFixed(2);

    return {
      totalDays,
      basePrice,
      subtotal,
      taxes,
      serviceFee,
      finalAmount
    };
  };

  const pricing = calculatePricing();

return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-luxury-900 border-luxury-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Add DialogTitle for accessibility - visually hidden for form step */}
        <DialogTitle className="sr-only">
          {currentStep === 'form' ? 'Booking Form' : 'Booking Confirmation'}
        </DialogTitle>
        
        {currentStep === 'form' ? (
          <>
            {bookingError && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-lg mb-4">
                {bookingError}
              </div>
            )}
            <BookingForm
              onSubmit={handleFormSubmit}
              onCancel={() => onOpenChange(false)}
              propertyName={propertyName}
              initialDateRange={initialDateRange}
              flat={flat}
              apartment={apartment}
              formData={formData}
              setFormData={setFormData}
              setStep={setStep}
            />
          </>
        ) : (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Booking Preview
              </DialogTitle>
              <DialogDescription className="text-center text-gray-300">
                Review your booking details and proceed to payment
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            {bookingData && (
              <div className="space-y-6 border border-luxury-700 rounded-lg p-6 bg-luxury-800/50">
                <div className="flex items-center gap-4 mb-4 border-b border-luxury-700 pb-4">
                  {propertyImage && (
                    <img
                      src={propertyImage}
                      alt={propertyName}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-xl text-white">{propertyName}</h3>
                    <p className="text-royal-300">Ready for booking confirmation</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Guest Information */}
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-royal-300 border-b border-luxury-700 pb-1">
                      Guest Information
                    </h4>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      <div className="text-gray-400">Guest Name:</div>
                      <div className="text-white font-medium">
                        {bookingData.firstName} {bookingData.lastName}
                      </div>

                      <div className="text-gray-400">Adults:</div>
                      <div className="text-white font-medium">{bookingData.adults}</div>

                      <div className="text-gray-400">Children:</div>
                      <div className="text-white font-medium">{bookingData.children}</div>

                      <div className="text-gray-400">Arrival Time:</div>
                      <div className="text-white font-medium">{bookingData.arrivalTime}</div>
                    </div>
                  </div>

                  {/* Stay Details */}
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-royal-300 border-b border-luxury-700 pb-1">
                      Stay Details
                    </h4>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      <div className="text-gray-400">Check-in:</div>
                      <div className="text-white font-medium">
                        {format(bookingData.checkIn, "EEE, MMM d, yyyy")}
                      </div>

                      <div className="text-gray-400">Check-out:</div>
                      <div className="text-white font-medium">
                        {format(bookingData.checkOut, "EEE, MMM d, yyyy")}
                      </div>

                      <div className="text-gray-400">Total Guests:</div>
                      <div className="text-white font-medium">
                        {bookingData.adults + bookingData.children} guests
                      </div>

                      <div className="text-gray-400">Duration:</div>
                      <div className="text-white font-medium">
                        {pricing?.totalDays} night{pricing?.totalDays !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Flat Details */}
                  {flat && (
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-royal-300 border-b border-luxury-700 pb-1">
                        Flat Details
                      </h4>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        <div className="text-gray-400">Flat Type:</div>
                        <div className="text-white font-medium">{flat.type}</div>

                        <div className="text-gray-400">Title:</div>
                        <div className="text-white font-medium">{flat.title}</div>

                        <div className="text-gray-400">Price:</div>
                        <div className="text-white font-medium">₹{flat.price.toLocaleString()}/night</div>

                        <div className="text-gray-400">Max Guests:</div>
                        <div className="text-white font-medium">{flat.maxOccupancy || 2} guests</div>

                        {flat.size && (
                          <>
                            <div className="text-gray-400">Size:</div>
                            <div className="text-white font-medium">{flat.size}</div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Pricing Details */}
                  {pricing && (
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-royal-300 border-b border-luxury-700 pb-1">
                        Pricing Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Base Price ({pricing.totalDays} nights):</span>
                          <span className="text-white">₹{pricing.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">GST (18%):</span>
                          <span className="text-white">₹{pricing.taxes.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Service Fee (5%):</span>
                          <span className="text-white">₹{pricing.serviceFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t border-luxury-700 pt-2 mt-2">
                          <span className="text-gray-400 font-semibold">Total Amount:</span>
                          <span className="text-white font-bold">₹{pricing.finalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact Details */}
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-royal-300 border-b border-luxury-700 pb-1">
                      Contact Details
                    </h4>
                    <div className="grid grid-cols-2 gap-y-2">
                      <div className="text-gray-400">Email:</div>
                      <div className="text-white font-medium">{bookingData.email}</div>

                      <div className="text-gray-400">Phone:</div>
                      <div className="text-white font-medium">{bookingData.phone}</div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-royal-300 border-b border-luxury-700 pb-1">
                      Address
                    </h4>
                    <div className="text-white">
                      <p>{bookingData.address}</p>
                      <p>{bookingData.city}, {bookingData.state} {bookingData.zipCode}</p>
                    </div>
                  </div>
                </div>

                {bookingData.specialRequests && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-royal-300 border-b border-luxury-700 pb-1">
                      Special Requests
                    </h4>
                    <div className="text-white font-medium text-sm bg-luxury-700/30 p-3 rounded-lg">
                      {bookingData.specialRequests}
                    </div>
                  </div>
                )}

                <div className="mt-6 text-center border-t border-luxury-700 pt-4">
                  <p className="text-gray-300">
                    Complete payment to confirm your booking
                  </p>
                  <p className="text-sm text-royal-300 mt-1 font-semibold">
                    Your booking will be confirmed after successful payment
                  </p>
                </div>
              </div>
            )}

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={handleNewBooking}
                className="border-gray-600 text-gray-300 w-full sm:w-auto"
                disabled={isProcessingPayment}
              >
                Edit Booking
              </Button>
              <Button
                onClick={handleProceedToPayment} 
                disabled={isProcessingPayment}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-2 px-6 rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all duration-200 w-full sm:w-auto"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
