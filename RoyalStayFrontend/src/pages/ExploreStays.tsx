import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Search, 
  MapPin, 
  Star, 
  Home, 
  Filter, 
  X, 
  Check, 
  CalendarIcon, 
  Tag,
  Copy,
  Clock,
  Gift,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Loader2,
  Zap,
  Percent,
  CloudCog
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { format, addDays } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import ApartmentDetailsDialog from '@/components/ApartmentDetailsDialog';
import { useBooking } from '@/hooks/use-booking';
import { Console } from 'console';

// types/apartment.ts
interface FlatType {
  _id?: string;
  type: "Single" | "1BHK" | "2BHK" | "3BHK";
  title: string;
  description?: string;
  price: number;
  baseprice: number;
  size?: string;
  maxOccupancy?: number;
  bedrooms?: number;
  bathrooms?: number;
  images: string[];
  features: string[];
  amenities: string[];
  rating?: number; // Added
  reviews?: number; // Added
}

interface Apartment {
  _id?: string;
  name: string;
  location: string;
  coverImage: string;
  amenities: string[];
  flats: FlatType[];
  rating: number; // Added
  reviews: number; // Added
  hasRestaurant: boolean; // Added
  hasGym: boolean; // Added
  hasPool?: boolean; // Optional additional amenities
  hasSpa?: boolean; // Optional additional amenities
  createdAt?: Date;
  updatedAt?: Date;
    __v: number;
  // We'll add these computed fields
  minPrice?: number;
  minBasePrice?: number;
  cheapestFlat?: FlatType;
}

interface ApartmentFormData {
  name: string;
  location: string;
  coverImage: string;
  amenities: string[];
  flats: FlatType[];
  rating?: number;
  reviews?: number;
  hasRestaurant: boolean;
  hasGym: boolean;
  hasPool?: boolean;
  hasSpa?: boolean;
}





const stays = [
  {
    id: 1,
    name: 'Sirinilaya Beachfront Apartments',
    location: 'Banglore, India',
    price: 1500,
    originalPrice: 1800,

    rating: 4.9,
    reviews: 127,
    image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80',
    amenities: ['Single/1BHK/2BHK/3BHK', 'Restaurant', 'Gym', 'WiFi', 'Pool'],
    bhkOptions: ['Single', '1BHK', '2BHK', '3BHK'],
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    hasRestaurant: true,
    hasGym: true
  },
  {
    id: 2,
    name: 'Sirinilaya Mountain View Residences',
    location: 'Banglore, India',
    price: 1250,
    originalPrice: 1500,
    rating: 4.8,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
    amenities: ['Single/1BHK/2BHK', 'Kitchen', 'Restaurant', 'WiFi', 'Parking'],
    bhkOptions: ['Single', '1BHK', '2BHK'],
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    hasRestaurant: true,
    hasGym: false
  },
  {
    id: 3,
    name: 'Sirinilaya Heritage Apartments', 
    location: 'Banglore, India',
    price: 1800,
    originalPrice: 2200,
    rating: 5.0,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    amenities: ['Single/2BHK/3BHK', 'Restaurant', 'Gym', 'Pool', 'WiFi'],
    bhkOptions: ['Single', '2BHK', '3BHK'],
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    hasRestaurant: true,
    hasGym: true
  },
  {
    id: 4,
    name: 'Sirinilaya Coastal Residences',  
    location: 'Banglore, India',
    price: 1400,
    originalPrice: 1700,
    rating: 4.7,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    amenities: ['Single/1BHK/2BHK/3BHK', 'Restaurant', 'Kitchen', 'WiFi', 'AC'],
    bhkOptions: ['Single', '1BHK', '2BHK', '3BHK'],
    guests: 5,
    bedrooms: 2,
    bathrooms: 2,
    hasRestaurant: true,
    hasGym: false
  },
  {
    id: 5,
    name: 'Sirinilaya Hill View Apartments',
    location: 'Banglore, India',
    price: 950,
    originalPrice: 1200,
    rating: 4.6,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    amenities: ['Single/1BHK/2BHK', 'Kitchen', 'Gym', 'WiFi', 'Parking'],
    bhkOptions: ['Single', '1BHK', '2BHK'],
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    hasRestaurant: false,
    hasGym: true
  },
  {
    id: 6,
    name: 'Sirinilaya Urban Luxury Apartments',
    location: 'Banglore, India',
    price: 2000, 
    originalPrice: 2500,
    rating: 4.9,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    amenities: ['Single/1BHK/2BHK/3BHK', 'Gym', 'Restaurant', 'WiFi', 'Kitchen'],
    bhkOptions: ['Single', '1BHK', '2BHK', '3BHK'],
    guests: 3,
    bedrooms: 1,
    bathrooms: 1,
    hasRestaurant: true,
    hasGym: true
  }
];

// Additional stays for load more functionality
const moreStays = [
  {
    id: 7,
    name: 'Sirinilaya Lakeside Apartments',
    location: 'Banglore, India',
    price: 1750,
    originalPrice: 2200,
    rating: 4.9,    
    reviews: 178,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    amenities: ['Single/2BHK/3BHK', 'Restaurant', 'Gym', 'Pool', 'WiFi'],
    bhkOptions: ['Single', '2BHK', '3BHK'],
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    hasRestaurant: true,
    hasGym: true
  },
  {
    id: 8,
    name: 'Sirinilaya Himalayan Residences',
    location: 'Banglore, India',
    price: 1350,
    originalPrice: 1600,
    rating: 4.7,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    amenities: ['Single/1BHK/2BHK/3BHK', 'Kitchen', 'Restaurant', 'WiFi', 'Parking'],
    bhkOptions: ['Single', '1BHK', '2BHK', '3BHK'],
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    hasRestaurant: true,
    hasGym: false
  },
  {
    id: 9,
    name: 'Sirinilaya Backwater Apartments',
    location: 'Banglore, India',
    price: 1200,
    originalPrice: 1500,
    rating: 4.8,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    amenities: ['Single/1BHK/2BHK', 'Kitchen', 'Restaurant', 'WiFi', 'AC'],
    bhkOptions: ['Single', '1BHK', '2BHK'],

    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    hasRestaurant: true,
    hasGym: false
  }
];

// Available coupon codes
const availableCoupons = [
  { code: 'WELCOME10', discount: 10, type: 'percent' },
  { code: 'LUXURY2000', discount: 2000, type: 'fixed' },
  { code: 'SUMMER25', discount: 25, type: 'percent' },
  { code: 'FIRSTBOOKING', discount: 15, type: 'percent' },
  { code: 'EARLYBIRD25', discount: 25, type: 'percent' },
  { code: 'WEEKEND2000', discount: 2000, type: 'fixed' },
  { code: 'EXTENDED30', discount: 30, type: 'percent' },
  { code: 'LUXURY5000', discount: 5000, type: 'fixed' },
  { code: 'MONSOON40', discount: 40, type: 'percent' }

  
];

const ExploreStays = () => {

   
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //const [bookingConfirmationDetails, setBookingConfirmationDetails] = useState(null);
  const [allStays, setAllStays] = useState(stays);
  const [filteredStays, setFilteredStays] = useState(stays);
  const [priceFilter, setPriceFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [bhkFilter, setBhkFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreStays, setShowMoreStays] = useState(false);
  const [bookingStay, setBookingStay] = useState<any>(null);
  const [showCouponDialog, setShowCouponDialog] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [bookingPrice, setBookingPrice] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<string>('');
  const [roomTypePrices, setRoomTypePrices] = useState<any>({});
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 7)
  });
const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
const [selectedApartment, setSelectedApartment] = useState(null);


  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/apartments');
        if (!response.ok) {
          throw new Error('Failed to fetch apartments');
        }
        const data: Apartment[] = await response.json();
        
        // Process data to find minimum priced flat for each apartment
        const processedData = data.map(apartment => {
          if (apartment.flats && apartment.flats.length > 0) {
            // Find the flat with the minimum price
            const cheapestFlat = apartment.flats.reduce((minFlat, currentFlat) => 
              currentFlat.price < minFlat.price ? currentFlat : minFlat
            );
            
            return {
              ...apartment,
              minPrice: cheapestFlat.price,
              minBasePrice: cheapestFlat.baseprice,
              cheapestFlat
            };
          }
          
          // Return apartment unchanged if no flats
          return apartment;
        });
        
        setApartments(processedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 12
  });

  // Offers dialog states
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Animation states
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [claimedOffer, setClaimedOffer] = useState<any>(null);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [bookingConfirmationDetails, setBookingConfirmationDetails] = useState<any>(null);

  const { openBooking } = useBooking();

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        let { hours, minutes, seconds } = prevTime;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset timer when it reaches 00:00:00
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time with leading zeros
  const formatTime = (time: number) => time.toString().padStart(2, '0');

  // Handle offer actions
  const handleOfferAction = (offerType: string, actionType: string) => {
    let offerData = {};
    
    switch (offerType) {
      case 'earlybird':
        offerData = {
          title: 'Early Bird Special',
          description: 'Book 30 days in advance and save up to 25% on luxury stays',
          discount: '25% OFF',
          couponCode: 'EARLYBIRD25',
          action: actionType
        };
        break;
      case 'weekend':
        offerData = {
          title: 'Weekend Escape',
          description: 'Perfect weekend getaways with complimentary spa sessions',
          discount: '₹2,000 OFF',
          couponCode: 'WEEKEND2000',
          action: actionType
        };
        break;
      case 'extended':
        offerData = {
          title: 'Extended Stay',
          description: 'Stay 7+ nights and enjoy exclusive perks & discounts',
          discount: '30% OFF',
          couponCode: 'EXTENDED30',
          action: actionType
        };
        break;
      case 'luxury':
        offerData = {
          title: 'Luxury Package',
          description: 'All-inclusive luxury with dining, spa & activities included',
          discount: '₹5,000 OFF',
          couponCode: 'LUXURY5000',
          action: actionType
        };
        break;
      case 'monsoon':
        offerData = {
          title: 'Monsoon Magic Sale',
          description: 'Experience the enchanting monsoon season with up to 40% off on hill station retreats',
          discount: '40% OFF',
          couponCode: 'MONSOON40',
          action: actionType
        };
        break;
    }
    
    setSelectedOffer(offerData);
    setShowOfferDialog(true);
  };

  const handleCopyCoupon = async (couponCode: string) => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = couponCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleClaimOffer = async () => {
    if (selectedOffer && selectedOffer.couponCode) {
      try {
        // Copy coupon code to clipboard
        await navigator.clipboard.writeText(selectedOffer.couponCode);
        
        // Auto-apply the coupon code
        setCouponCode(selectedOffer.couponCode);
        
        // Set claimed offer for animation with phone display style
        setClaimedOffer({
          ...selectedOffer,
          copied: true,
          usePhoneStyle: true,
          claimTime: new Date(),
          claimId: `SC${Math.floor(100000 + Math.random() * 900000)}`, // Generate random claim ID
          expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)) // 30 days validity
        });
        
        // Close dialog and show success animation
        setShowOfferDialog(false);
        setShowSuccessAnimation(true);
        
        // Hide animation after 6 seconds
        setTimeout(() => {
          setShowSuccessAnimation(false);
          setClaimedOffer(null);
        }, 6000);
        
      } catch (err) {
        // Fallback if clipboard API fails
        setCouponCode(selectedOffer.couponCode);
        
        // Set claimed offer for animation (without copy confirmation)
        setClaimedOffer({
          ...selectedOffer,
          copied: false,
          usePhoneStyle: true,
          claimTime: new Date(),
          claimId:` SC${Math.floor(100000 + Math.random() * 900000)}`, // Generate random claim ID
          expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)) // 30 days validity
        });
        
        // Close dialog and show success animation
        setShowOfferDialog(false);
        setShowSuccessAnimation(true);
        
        // Hide animation after 6 seconds
        setTimeout(() => {
          setShowSuccessAnimation(false);
          setClaimedOffer(null);
        }, 6000);
      }
    }
  };

  // Load more stays functionality
  useEffect(() => {
    if (showMoreStays) {
      setAllStays([...stays, ...moreStays]);
    } else {
      setAllStays([...stays]);
    }
  }, [showMoreStays]);

  // Apply all filters whenever any filter changes
  useEffect(() => {
    applyFilters();
  }, [allStays, priceFilter, locationFilter, bhkFilter, searchQuery]);

  // Handle booking modal
  useEffect(() => {
    if (bookingStay) {
      setBookingPrice(bookingStay.price);
    }
  }, [bookingStay]);

  // Apply all filters
  const applyFilters = () => {
    let filtered = [...allStays];
    
    // Apply price filter
    if (priceFilter === 'low') {
      filtered = filtered.filter(stay => stay.price < 12000);
    } else if (priceFilter === 'mid') {
      filtered = filtered.filter(stay => stay.price >= 12000 && stay.price < 18000);
    } else if (priceFilter === 'high') {
      filtered = filtered.filter(stay => stay.price >= 18000);
    }
    
    // Apply location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(stay => 
        stay.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    // Apply BHK filter
    if (bhkFilter !== 'all') {
      filtered = filtered.filter(stay => 
        stay.bhkOptions.includes(bhkFilter)
      );
    }
    
    // Apply search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(stay => 
        stay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stay.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stay.amenities.some(amenity => 
          amenity.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        stay.bhkOptions.some(bhk =>
          bhk.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    
    setFilteredStays(filtered);
  };

  const handlePriceFilter = (range: string) => {
    setPriceFilter(range);
  };
  
  const handleBhkFilter = (bhk: string) => {
    setBhkFilter(bhk);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleLoadMore = () => {
    setShowMoreStays(true);
  };
  
  const handleViewProperty = (property: any) => {
    console.log(property);
    setSelectedProperty(property);
    setIsDetailsDialogOpen(true);
  };
  
  const handleBookNow = (apartment: Apartment) => {
    // Open the booking dialog with apartment data only
    openBooking({
      propertyName: apartment.name,
      propertyImage: apartment.coverImage,
      initialDateRange: {
        from: new Date(),
        to: addDays(new Date(), 7)
      },
      apartment: apartment, // Pass the apartment
      // Don't pass a specific flat - let user choose in RoomSelectionModal
    });
  };
  
  const handleRoomTypeChange = (roomType: string) => {
    setSelectedRoomType(roomType);
    setBookingPrice(calculateTotalPrice(roomType));
  };
  
  // Calculate original total without any discount
  const calculateOriginalTotal = (roomType?: string) => {
    const type = roomType || selectedRoomType;
    if (!dateRange.from || !dateRange.to || !roomTypePrices[type]) return roomTypePrices[type];
    
    // Calculate number of nights
    const nights = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate base total (per night * nights)
    return roomTypePrices[type] * nights;
  };

  // Calculate discount amount based on per-night rate
  const calculateDiscountAmount = () => {
    if (!appliedCoupon || !dateRange.from || !dateRange.to) return 0;
    
    const perNightRate = roomTypePrices[selectedRoomType];
    const nights = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    
    if (appliedCoupon.type === 'percent') {
      // Calculate percentage discount on per-night rate, then multiply by nights
      const discountPerNight = (perNightRate * appliedCoupon.discount) / 100;
      return discountPerNight * nights;
    } else {
      // Fixed discount applied once (not per night)
      return appliedCoupon.discount;
    }
  };

  const calculateTotalPrice = (roomType?: string) => {
    const originalTotal = calculateOriginalTotal(roomType);
    const discountAmount = calculateDiscountAmount();
    return originalTotal - discountAmount;
  };

  const handleApplyCoupon = () => {
    // Reset previous messages
    setCouponError('');
    setCouponSuccess('');
    
    // Check if coupon exists
    const coupon = availableCoupons.find(
      c => c.code.toLowerCase() === couponCode.toLowerCase()
    );
    
    if (!coupon) {
      setCouponError('Invalid coupon code');
      return;
    }
    
    // Apply discount
    setAppliedCoupon(coupon);
    
    // Update booking price
    setBookingPrice(calculateTotalPrice());
    
    if (coupon.type === 'percent') {
      setCouponSuccess(`${coupon.discount}% discount applied!`);
    } else {
      setCouponSuccess(`₹${coupon.discount.toLocaleString()} discount applied!`);
    }
  };
  
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    setCouponSuccess('');
    setBookingPrice(calculateTotalPrice());
  };
  
  // Update booking price whenever date range changes
  useEffect(() => {
    if (bookingStay) {
      setBookingPrice(calculateTotalPrice());
    }
  }, [dateRange]);
  
  const handleCompleteBooking = () => {
    // In a real app, this would submit the booking to a backend
    const nights = Math.ceil((dateRange.to!.getTime() - dateRange.from!.getTime()) / (1000 * 60 * 60 * 24));
    
    // Create booking confirmation details
    setBookingConfirmationDetails({
      property: bookingStay,
      roomType: selectedRoomType,
      checkIn: dateRange.from,
      checkOut: dateRange.to,
      nights: nights,
      price: bookingPrice,
      originalPrice: calculateOriginalTotal(),
      discount: calculateDiscountAmount(),
      coupon: appliedCoupon,
      bookingId: `SN${Math.floor(100000 + Math.random() * 900000)}`, // Generate random booking ID
      bookingTime: new Date(),
      confirmationNumber: Math.random().toString(36).substring(2, 10).toUpperCase()
    });
    
    // Close dialog and show confirmation animation
    setShowCouponDialog(false);
    setShowBookingConfirmation(true);
    
    // Auto-hide confirmation after 8 seconds
    setTimeout(() => {
      setShowBookingConfirmation(false);
      setBookingConfirmationDetails(null);
      setBookingStay(null);
    }, 8000);
  };


  
  return (
    <div className="min-h-screen bg-luxury-950">
      <Navbar />
      
      {/* Header Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              Explore <span className="gradient-text">Luxury Apartments</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover premium 1BHK, 2BHK, and 3BHK apartments with world-class amenities
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search locations, BHK options, or amenities..."
                className="w-full pl-10 pr-4 py-3 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-royal-400"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <select
                value={priceFilter}
                onChange={(e) => handlePriceFilter(e.target.value)}
                className="px-4 py-3 bg-luxury-800 border border-luxury-700 rounded-lg text-white focus:outline-none focus:border-royal-400"
              >
                <option value="all">All Prices</option>
                <option value="low">Under ₹12,000</option>
                <option value="mid">₹12,000 - ₹18,000</option>
                <option value="high">Above ₹18,000</option>
              </select>
              
              <select
                value={bhkFilter}
                onChange={(e) => handleBhkFilter(e.target.value)}
                className="px-4 py-3 bg-luxury-800 border border-luxury-700 rounded-lg text-white focus:outline-none focus:border-royal-400"
              >
                <option value="all">All Room Types</option>
                <option value="Single">Single Room Only</option>
                <option value="1BHK">1 BHK Only</option>
                <option value="2BHK">2 BHK Only</option>
                <option value="3BHK">3 BHK Only</option>
              </select>
              
              <Button variant="outline" size="sm" className="border-royal-400 text-royal-400">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Offers & Deals Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">bg-gradient-to-br from-royal-900/20 to-luxury-900/40
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Exclusive <span className="gradient-text">Offers & Deals</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Unlock extraordinary savings on your next luxury getaway
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Early Bird Special */}
            <div className="luxury-card p-6 rounded-xl hover-lift group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-400 text-sm font-semibold bg-green-500/20 px-3 py-1 rounded-full">
                  Limited Time
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Early Bird Special</h3>
              <p className="text-gray-300 text-sm mb-4">Book 30 days in advance and save up to 25% on luxury stays</p>
              <div className="text-3xl font-bold gradient-text mb-2">25% OFF</div>
              <Button size="sm" variant="outline" className="w-full border-green-400 text-green-400 hover:bg-green-400 hover:text-luxury-950" onClick={() => handleOfferAction('earlybird', 'claim')}>
                Claim Deal
              </Button>
            </div>

            {/* Weekend Escape */}
            <div className="luxury-card p-6 rounded-xl hover-lift group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-purple-400 text-sm font-semibold bg-purple-500/20 px-3 py-1 rounded-full">
                  Hot Deal
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Weekend Escape</h3>
              <p className="text-gray-300 text-sm mb-4">Perfect weekend getaways with complimentary spa sessions</p>
              <div className="text-3xl font-bold gradient-text mb-2">₹2,000 OFF</div>
              <Button size="sm" variant="outline" className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-luxury-950" onClick={() => handleOfferAction('weekend', 'book')}>
                Book Now
              </Button>
            </div>

            {/* Extended Stay */}
            <div className="luxury-card p-6 rounded-xl hover-lift group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Percent className="w-6 h-6 text-white" />
                </div>
                <span className="text-orange-400 text-sm font-semibold bg-orange-500/20 px-3 py-1 rounded-full">
                  Best Value
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Extended Stay</h3>
              <p className="text-gray-300 text-sm mb-4">Stay 7+ nights and enjoy exclusive perks & discounts</p>
              <div className="text-3xl font-bold gradient-text mb-2">30% OFF</div>
              <Button size="sm" variant="outline" className="w-full border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-luxury-950" onClick={() => handleOfferAction('extended', 'explore')}>
                Explore
              </Button>
            </div>

            {/* Luxury Package */}
            <div className="luxury-card p-6 rounded-xl hover-lift group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-royal-500 to-royal-600 rounded-lg flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <span className="text-royal-400 text-sm font-semibold bg-royal-500/20 px-3 py-1 rounded-full">
                  Premium
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Luxury Package</h3>
              <p className="text-gray-300 text-sm mb-4">All-inclusive luxury with dining, spa & activities included</p>
              <div className="text-3xl font-bold gradient-text mb-2">₹5,000 OFF</div>
              <Button size="sm" variant="outline" className="w-full border-royal-400 text-royal-400 hover:bg-royal-400 hover:text-luxury-950" onClick={() => handleOfferAction('luxury', 'view')}>
                View Package
              </Button>
            </div>
          </div>

          {/* Featured Banner Deal */}
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-royal-600/90 to-purple-600/90"></div>
            <div className="relative p-8 sm:p-12 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-2 mb-6">
                  <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                  <span className="text-white text-sm font-semibold">Flash Sale - 48 Hours Only!</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Monsoon Magic Sale
                </h3>
                <p className="text-xl text-white/90 mb-8">
                  Experience the enchanting monsoon season with up to 40% off on hill station retreats
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" className="bg-white text-royal-600 hover:bg-gray-100 font-semibold px-8" onClick={() => handleOfferAction('monsoon', 'claim')}>
                    Claim 40% OFF
                  </Button>
                  <div className="text-white/80 text-sm">
                    Offer expires in: <span className="font-bold text-yellow-400">{`${formatTime(timeLeft.hours)}:${formatTime(timeLeft.minutes)}:${formatTime(timeLeft.seconds)}`}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stays Grid */}
      <section 
      id = "stays-section"
      className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-royal-300 flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              Click on any property to view detailed BHK options and amenities
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apartments.map((stay, index) => (
              <div 
                key={stay._id}
                className="luxury-card rounded-xl overflow-hidden hover-lift group animate-scale-in cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleViewProperty(stay)}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={stay.coverImage}
                    alt={stay.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <div className="glass-morphism px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm font-medium">{stay.rating}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center text-white">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{stay.location}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">{stay.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Home className="w-4 h-4 text-royal-400" />
                    <p className="text-gray-300 text-sm">
                      Available as:    {stay.flats.map((flat) => (
                      <span 
                        key={flat._id}
                        className='mx-1'
                      >
                        {flat.type}
                      </span>
                    ))}
                    </p>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{stay.reviews} reviews</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                      {stay.flats.map((flat) => (
                      <span 
                        key={flat._id}
                        className="px-3 py-1 bg-royal-900/30 text-royal-300 text-xs rounded-full border border-royal-700"
                      >
                        {flat.type}
                      </span>
                    ))}
                    {stay.hasRestaurant && (
                      <span className="px-3 py-1 bg-royal-900/30 text-royal-300 text-xs rounded-full border border-royal-700">
                        Restaurant
                      </span>
                    )}
                    {stay.hasGym && (
                      <span className="px-3 py-1 bg-royal-900/30 text-royal-300 text-xs rounded-full border border-royal-700">
                        Gym
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-white">₹{stay.minPrice.toLocaleString()}</span>
                        {stay.minBasePrice > stay.minPrice && (
                          <span className="text-gray-400 text-sm line-through">₹{stay.minBasePrice.toLocaleString()}</span>
                        )}
                      </div>
                      <span className="text-gray-400 text-sm">/night</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-royal-400 text-royal-400 hover:bg-royal-400/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewProperty(stay);
                        }}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-royal-gradient hover:shadow-lg hover:shadow-royal-500/25 transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookNow(stay);
                        }}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button 
              variant="outline"
              size="lg"
              className="border-royal-400 text-royal-400 hover:bg-royal-400 hover:text-luxury-950 px-8 py-4 h-auto font-semibold"
              onClick={handleLoadMore}
              disabled={showMoreStays}
            >
              {showMoreStays ? 'All Stays Loaded' : 'Load More Stays'}
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Property Details Modal */}
      {selectedProperty && (
<ApartmentDetailsDialog
  open={isDetailsDialogOpen}
  onOpenChange={setIsDetailsDialogOpen}
  apartment={selectedProperty}
/>
      )}

      {/* Booking Dialog with Coupon System */}
      {bookingStay && (
        <Dialog open={showCouponDialog} onOpenChange={setShowCouponDialog}>
          <DialogContent className="bg-gradient-to-br from-luxury-900 via-luxury-800 to-luxury-900 border-2 border-royal-500/30 text-white max-w-md max-h-[95vh] overflow-hidden rounded-3xl shadow-2xl shadow-royal-500/20">
            {/* Phone-like Status Bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-royal-600/20 to-purple-600/20 rounded-t-3xl border-b border-royal-500/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-300">Sirinilaya Booking</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                <div className="w-1 h-1 bg-white/60 rounded-full"></div>
              </div>
            </div>

            <DialogHeader className="sticky top-0 bg-gradient-to-r from-luxury-900/95 to-luxury-800/95 backdrop-blur-md z-10 px-6 py-4 border-b border-royal-500/20">
              <DialogTitle className="text-lg font-bold bg-gradient-to-r from-royal-400 to-purple-400 bg-clip-text text-transparent">
                📱 Book {bookingStay.name}
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-xs">
                ✨ Complete your luxury booking
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 py-4 space-y-4 overflow-y-auto max-h-[calc(95vh-200px)]">
              {/* Property Card - Phone Style */}
              <div className="bg-gradient-to-r from-royal-900/40 to-purple-900/40 rounded-2xl p-4 border border-royal-500/20 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={bookingStay.image} 
                      alt={bookingStay.name}
                      className="w-16 h-16 rounded-xl object-cover ring-2 ring-royal-400/30"
                    />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm">{bookingStay.location}</h3>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                      <span className="text-yellow-400 font-medium">{bookingStay.rating}</span>
                      <span className="ml-1">({bookingStay.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Type Selection - Phone Style */}
              <div className="bg-gradient-to-r from-luxury-900/60 to-luxury-800/60 rounded-2xl p-4 border border-royal-500/20">
                <h4 className="font-semibold flex items-center gap-2 text-sm text-royal-300 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-royal-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Home className="w-3 h-3 text-white" />
                  </div>
                  Room Selection
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {bookingStay.bhkOptions.map((option: string) => (
                    <Button
                      key={option}
                      size="sm"
                      variant={selectedRoomType === option ? "default" : "outline"}
                      className={selectedRoomType === option 
                        ? "bg-gradient-to-r from-royal-600 to-purple-600 hover:from-royal-700 hover:to-purple-700 text-xs font-medium border-0 shadow-lg shadow-royal-500/30" 
                        : "border-royal-500/30 text-gray-300 hover:bg-royal-900/50 hover:border-royal-400/50 text-xs backdrop-blur-sm"}
                      onClick={() => handleRoomTypeChange(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Date Range Selection - Phone Style */}
              <div className="bg-gradient-to-r from-luxury-900/60 to-luxury-800/60 rounded-2xl p-4 border border-royal-500/20">
                <h4 className="font-semibold flex items-center gap-2 text-sm text-royal-300 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-royal-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <CalendarIcon className="w-3 h-3 text-white" />
                  </div>
                  Check-in & Check-out
                </h4>
                <div className="space-y-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left font-normal border-royal-500/30 text-gray-300 hover:bg-royal-900/50 hover:border-royal-400/50 text-xs backdrop-blur-sm rounded-xl"
                      >
                        <CalendarIcon className="mr-2 h-3 w-3 text-royal-400" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              📅 {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                            </>
                          ) : (
                            format(dateRange.from, "MMM dd, y")
                          )
                        ) : (
                          <span>📅 Pick your dates</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gradient-to-br from-luxury-900 to-luxury-800 border-royal-500/30 rounded-2xl shadow-2xl" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={1}
                        disabled={{ before: new Date() }}
                        className="bg-transparent text-white rounded-2xl"
                      />
                    </PopoverContent>
                  </Popover>
                  
                  {dateRange?.from && dateRange?.to && (
                    <div className="flex items-center justify-between bg-royal-900/30 rounded-xl p-2 border border-royal-500/20">
                      <span className="text-xs text-gray-300">Duration:</span>
                      <span className="text-xs text-royal-300 font-medium">
                        🌙 {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} nights
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Summary - Phone Style */}
              <div className="bg-gradient-to-r from-luxury-900/60 to-luxury-800/60 rounded-2xl p-4 border border-royal-500/20 space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-300">💰 {selectedRoomType} Rate</span>
                  <span className="text-sm font-medium text-royal-300">₹{roomTypePrices[selectedRoomType]?.toLocaleString()}/night</span>
                </div>
                
                {dateRange?.from && dateRange?.to && (
                  <div className="flex justify-between items-center py-2 border-t border-royal-500/20">
                    <span className="text-sm text-gray-300">🌙 Duration</span>
                    <span className="text-sm font-medium text-royal-300">{Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} nights</span>
                  </div>
                )}

                {/* Coupon Section - Phone Style */}
                <div className="border-t border-royal-500/20 pt-3">
                  <h4 className="font-semibold flex items-center gap-2 text-sm text-royal-300 mb-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-royal-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Tag className="w-3 h-3 text-white" />
                    </div>
                    Promo Code
                  </h4>

                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="🎫 Enter promo code"
                        className="flex-1 px-4 py-3 bg-royal-900/30 border border-royal-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-royal-400 focus:bg-royal-900/50 text-sm backdrop-blur-sm"
                      />
                      <Button 
                        size="sm"
                        onClick={handleApplyCoupon}
                        className="bg-gradient-to-r from-royal-600 to-purple-600 hover:from-royal-700 hover:to-purple-700 text-xs font-medium px-4 rounded-xl shadow-lg shadow-royal-500/30"
                      >
                        Apply
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-gradient-to-r from-green-900/30 to-emerald-900/30 p-3 rounded-xl border border-green-500/30 shadow-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-medium text-sm text-green-300">🎫 {appliedCoupon.code}</span>
                        </div>
                        <p className="text-xs text-green-400 mt-1">
                          💰 {appliedCoupon.type === 'percent' 
                            ? `${appliedCoupon.discount}% off` 
                            : `₹${appliedCoupon.discount.toLocaleString()} off`}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleRemoveCoupon}
                        className="text-gray-400 hover:text-white hover:bg-red-500/20 rounded-lg"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}

                  {couponError && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-2 mt-2">
                      <p className="text-red-400 text-xs">❌ {couponError}</p>
                    </div>
                  )}
                  
                  {couponSuccess && (
                    <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-2 mt-2">
                      <p className="text-green-400 text-xs">✅ {couponSuccess}</p>
                    </div>
                  )}

                  <div className="bg-royal-900/20 rounded-xl p-2 mt-2">
                    <p className="text-xs text-gray-400">💡 Try: WELCOME10, LUXURY2000, SUMMER25</p>
                  </div>
                </div>

                {/* Total Price - Phone Style */}
                <div className="bg-gradient-to-r from-royal-600/20 to-purple-600/20 rounded-xl p-4 border border-royal-400/30 shadow-lg">
                  {appliedCoupon && dateRange?.from && dateRange?.to ? (
                    <div className="space-y-2">
                      {/* Per Night Rate */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">🏠 {selectedRoomType} Rate</span>
                        <span className="text-sm text-gray-300">
                          ₹{roomTypePrices[selectedRoomType]?.toLocaleString()}/night
                        </span>
                      </div>
                      
                      {/* Number of Nights */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">🌙 Duration</span>
                        <span className="text-sm text-gray-300">
                          {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} nights
                        </span>
                      </div>
                      
                      {/* Original Total */}
                      <div className="flex justify-between items-center border-t border-royal-400/20 pt-2">
                        <span className="text-sm text-gray-300">💰 Subtotal</span>
                        <span className="text-sm text-gray-300 line-through">
                          ₹{calculateOriginalTotal().toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Discount Amount */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-400">
                          🎫 Discount ({appliedCoupon.code})
                          {appliedCoupon.type === 'percent' && (
                            <span className="text-xs ml-1">
                              ({appliedCoupon.discount}% off per night)
                            </span>
                          )}
                        </span>
                        <span className="text-sm text-green-400">
                          -₹{Math.floor(calculateDiscountAmount()).toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Final Price */}
                      <div className="flex justify-between items-center border-t border-royal-400/30 pt-2">
                        <span className="text-sm font-medium text-royal-300">💳 Final Amount</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-royal-400 to-purple-400 bg-clip-text text-transparent">
                          ₹{bookingPrice.toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Savings Badge */}
                      <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg p-2 border border-green-500/30">
                        <div className="text-center">
                          <span className="text-xs text-green-300 font-medium">
                            🎉 You saved ₹{Math.floor(calculateDiscountAmount()).toLocaleString()}
                            {appliedCoupon.type === 'percent' && (
                              <span className="text-xs ml-1">
                                (₹{Math.floor((roomTypePrices[selectedRoomType] * appliedCoupon.discount) / 100)} per night)
                              </span>
                            )}!
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-royal-300">💳 Total Amount</span>
                      <span className="text-xl font-bold bg-gradient-to-r from-royal-400 to-purple-400 bg-clip-text text-transparent">
                        ₹{bookingPrice.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Phone-style Footer */}
            <div className="sticky bottom-0 bg-gradient-to-r from-luxury-900/95 to-luxury-800/95 backdrop-blur-md px-6 py-4 border-t border-royal-500/20 rounded-b-3xl">
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowCouponDialog(false)}
                  className="flex-1 border-royal-500/30 text-gray-300 hover:bg-royal-900/50 hover:border-royal-400/50 text-xs rounded-xl backdrop-blur-sm"
                >
                  ❌ Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={handleCompleteBooking}
                  className="flex-2 bg-gradient-to-r from-royal-600 to-purple-600 hover:from-royal-700 hover:to-purple-700 text-xs font-medium rounded-xl shadow-lg shadow-royal-500/30"
                >
                  ✅ Confirm Booking
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

             {/* Offers Dialog - Phone Style */}
       {showOfferDialog && (
         <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
           <DialogContent className="bg-gradient-to-br from-luxury-900 via-luxury-800 to-luxury-900 border-2 border-royal-500/30 text-white max-w-md max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl shadow-royal-500/20">
             {/* Phone-like Status Bar */}
             <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-royal-600/20 to-purple-600/20 rounded-t-3xl border-b border-royal-500/20">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                 <span className="text-xs text-gray-300">Sirinilaya Offers</span>
               </div>
               <div className="flex items-center gap-1">
                 <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                 <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                 <div className="w-1 h-1 bg-white/60 rounded-full"></div>
               </div>
             </div>

             <DialogHeader className="sticky top-0 bg-gradient-to-r from-luxury-900/95 to-luxury-800/95 backdrop-blur-md z-10 px-6 py-4 border-b border-royal-500/20">
               <DialogTitle className="text-xl font-bold bg-gradient-to-r from-royal-400 to-purple-400 bg-clip-text text-transparent">
                 🎯 {selectedOffer?.title}
               </DialogTitle>
               <DialogDescription className="text-gray-300 text-sm">
                 {selectedOffer?.description}
               </DialogDescription>
             </DialogHeader>

             <div className="px-6 py-4 space-y-4 overflow-y-auto max-h-[calc(90vh-200px)]">
               {/* Discount Badge - Phone Style */}
               <div className="text-center">
                 <div className="inline-flex items-center bg-gradient-to-r from-royal-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-3xl font-bold mb-4 shadow-lg shadow-royal-500/30 animate-pulse">
                   <Gift className="w-8 h-8 mr-3" />
                   {selectedOffer?.discount}
                 </div>
               </div>

               {/* Coupon Code Card - Phone Style */}
               <div className="bg-gradient-to-r from-royal-900/40 to-purple-900/40 rounded-2xl p-4 border border-royal-500/20 shadow-lg">
                 <p className="text-sm text-royal-300 mb-2 text-center">Use coupon code:</p>
                 <div className="bg-royal-900/50 border border-royal-500/30 rounded-xl p-4 text-center">
                   <div className="flex items-center justify-center gap-3 mb-2">
                     <span className="text-2xl font-mono font-bold text-royal-300 tracking-wider">
                       {selectedOffer?.couponCode}
                     </span>
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => handleCopyCoupon(selectedOffer?.couponCode)}
                       className="border-royal-400 text-royal-400 hover:bg-royal-400 hover:text-white"
                     >
                       {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                     </Button>
                   </div>
                   {copySuccess && (
                     <p className="text-green-400 text-sm flex items-center justify-center gap-1">
                       <Check className="w-3 h-3" />
                       Copied to clipboard!
                     </p>
                   )}
                 </div>
               </div>

               {/* Instructions Card - Phone Style */}
               <div className="bg-gradient-to-r from-luxury-900/60 to-luxury-800/60 rounded-2xl p-4 border border-royal-500/20">
                 <h4 className="font-semibold text-royal-300 mb-3 text-center">How to use this offer:</h4>
                 <ul className="text-sm text-gray-300 space-y-2">
                   <li className="flex items-start gap-2">
                     <div className="w-5 h-5 bg-royal-800 rounded-full flex items-center justify-center text-xs text-royal-300 mt-0.5">1</div>
                     <span>Select any property from our collection</span>
                   </li>
                   <li className="flex items-start gap-2">
                     <div className="w-5 h-5 bg-royal-800 rounded-full flex items-center justify-center text-xs text-royal-300 mt-0.5">2</div>
                     <span>Click "Book Now" to start booking process</span>
                   </li>
                   <li className="flex items-start gap-2">
                     <div className="w-5 h-5 bg-royal-800 rounded-full flex items-center justify-center text-xs text-royal-300 mt-0.5">3</div>
                     <span>Enter the coupon code during checkout</span>
                   </li>
                   <li className="flex items-start gap-2">
                     <div className="w-5 h-5 bg-royal-800 rounded-full flex items-center justify-center text-xs text-royal-300 mt-0.5">4</div>
                     <span>Enjoy your discounted luxury stay!</span>
                   </li>
                 </ul>
               </div>

               {/* Special Offer Card - Phone Style */}
               {selectedOffer?.action === 'claim' && (
                 <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-4 border border-green-500/30 shadow-lg">
                   <div className="flex items-center gap-2 mb-2">
                     <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                       <Check className="w-4 h-4 text-white" />
                     </div>
                     <span className="font-medium text-green-300">Special Offer</span>
                   </div>
                   <p className="text-sm text-gray-300">
                     This exclusive offer will be automatically applied to your next booking. 
                     The coupon code has been saved for you!
                   </p>
                 </div>
               )}

               {/* Monsoon Magic Sale Timer - Phone Style */}
               {selectedOffer?.title === 'Monsoon Magic Sale' && (
                 <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-2xl p-4 border border-yellow-500/30 shadow-lg">
                   <div className="flex items-center gap-2 mb-3">
                     <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                       <Clock className="w-4 h-4 text-white" />
                     </div>
                     <span className="font-medium text-yellow-300">Limited Time Offer</span>
                   </div>
                   <p className="text-sm text-gray-300 text-center mb-2">
                     Hurry! This flash sale expires in:
                   </p>
                   <div className="text-center">
                     <span className="inline-block bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 py-2 rounded-xl font-mono text-lg font-bold animate-pulse">
                       {`${formatTime(timeLeft.hours)}:${formatTime(timeLeft.minutes)}:${formatTime(timeLeft.seconds)}`}
                     </span>
                   </div>
                 </div>
               )}
             </div>

             {/* Footer - Phone Style */}
             <div className="sticky bottom-0 bg-gradient-to-r from-luxury-900/95 to-luxury-800/95 backdrop-blur-md p-4 border-t border-royal-500/20 flex gap-3">
               <Button 
                 variant="outline" 
                 onClick={() => setShowOfferDialog(false)}
                 className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1"
               >
                 Close
               </Button>
               <Button 
                 onClick={handleClaimOffer}
                 className="bg-gradient-to-r from-royal-600 to-purple-600 hover:from-royal-700 hover:to-purple-700 text-white shadow-lg hover:shadow-royal-500/25 flex-1 font-semibold"
               >
                 {selectedOffer?.action === 'claim' ? 'Claim Offer' : 
                  selectedOffer?.action === 'book' ? 'Book Now' :
                  selectedOffer?.action === 'explore' ? 'Explore Deals' : 'View Package'}
               </Button>
             </div>
           </DialogContent>
         </Dialog>
       )}

       {/* Success Animation Overlay */}
       {showSuccessAnimation && claimedOffer && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
           {claimedOffer.usePhoneStyle ? (
             <div className="relative w-full max-w-sm mx-4">
               {/* Fireworks Animation */}
               <div className="absolute inset-0 pointer-events-none overflow-hidden">
                 {/* Firework bursts */}
                 {[...Array(10)].map((_, i) => (
                   <div key={`firework-${i}`} className="absolute">
                     {[...Array(8)].map((_, j) => (
                       <div
                         key={`spark-${i}-${j}`}
                         className="absolute h-1 w-12 origin-left"
                         style={{
                           left: `${Math.random() * 100}%`,
                           top: `${Math.random() * 100}%`,
                           transform: `rotate(${j * 45}deg)`,
                           opacity: 0,
                           animation: `firework-spark 0.6s ease-out ${i * 0.1}s forwards`
                         }}
                       >
                         <div 
                           className="h-full w-full rounded-full animate-ping"
                           style={{
                             background: `linear-gradient(90deg, 
                               ${['#FFD700', '#FF6B6B', '#4ECDC4', '#FF8C42', '#A06CD5', '#45B8AC'][i % 6]} 0%, 
                               transparent 100%)`
                           }}
                         />
                       </div>
                     ))}
                   </div>
                 ))}
                 
                 {/* Floating stars */}
                 {[...Array(15)].map((_, i) => (
                   <div
                     key={`star-${i}`}
                     className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                     style={{
                       left: `${Math.random() * 100}%`,
                       top: `${Math.random() * 100}%`,
                       animationDelay: `${Math.random() * 3}s`,
                       animationDuration: `${1 + Math.random() * 1}s`
                     }}
                   />
                 ))}
               </div>

               {/* Phone-style Success Card - Compact */}
               <div className="bg-gradient-to-br from-luxury-900 via-luxury-800 to-luxury-900 border-2 border-royal-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-royal-500/20 animate-[zoomInFade_0.8s_ease-out]">
                 {/* Phone-like Status Bar */}
                 <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-royal-600/20 to-purple-600/20 rounded-t-3xl border-b border-royal-500/20">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                     <span className="text-xs text-gray-300">Sirinilaya Offers</span>
                   </div>
                   <div className="flex items-center gap-1">
                     <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                     <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                     <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                   </div>
                 </div>
                 
                 {/* Header with confetti - Compact */}
                 <div className="relative bg-gradient-to-r from-royal-600 to-purple-600 py-4 px-6 overflow-hidden">
                   {/* Animated confetti in header */}
                   {[...Array(12)].map((_, i) => (
                     <div
                       key={`header-confetti-${i}`}
                       className="absolute w-1.5 h-1.5 rounded-full animate-float-confetti"
                       style={{
                         backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#FF8C42', '#A06CD5'][i % 5],
                         left: `${Math.random() * 100}%`,
                         top: `${Math.random() * 100}%`,
                         animationDelay: `${Math.random() * 3}s`,
                         animationDuration: `${2 + Math.random() * 1}s`
                       }}
                     />
                   ))}
                   
                   {/* Success checkmark - Smaller */}
                   <div className="flex items-center justify-center mb-2">
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg animate-[bounceIn_0.6s_ease-out]">
                       <Check className="w-7 h-7 text-green-500 animate-[checkmark_0.8s_ease-in-out]" />
                     </div>
                   </div>
                   
                   <h2 className="text-xl font-bold text-white text-center animate-[fadeInUp_0.8s_ease-out_0.3s_both]">
                     Offer Claimed!
                   </h2>
                   
                   <div className="text-center mt-1 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
                     <span className="inline-block bg-white/20 text-white text-xs py-1 px-2 rounded-full">
                       ID: {claimedOffer.claimId}
                     </span>
                   </div>
                 </div>
                 
                 {/* Offer details - Compact */}
                 <div className="p-4 animate-[fadeInUp_0.8s_ease-out_0.5s_both]">
                   <div className="bg-gradient-to-r from-luxury-900/60 to-luxury-800/60 rounded-xl p-3 border border-royal-500/20 mb-3">
                     <h3 className="font-semibold text-royal-300 text-base mb-1">
                       {claimedOffer.title}
                     </h3>
                     <p className="text-gray-300 text-xs">
                       {claimedOffer.description}
                     </p>
                   </div>
                   
                   {/* Coupon Code Card - Compact */}
                   <div className="bg-gradient-to-r from-royal-900/40 to-purple-900/40 rounded-xl p-3 border border-royal-500/20 shadow-lg mb-3 animate-[fadeInRight_0.5s_ease-out_0.6s_both]">
                     <div className="flex items-center justify-between mb-1">
                       <span className="text-xs text-royal-300">Coupon Code</span>
                       <span className="text-xs text-gray-400">Valid till {format(claimedOffer.expiryDate, "dd MMM")}</span>
                     </div>
                     
                     <div className="bg-royal-900/50 border border-royal-500/30 rounded-lg p-2 text-center">
                       <div className="font-mono text-lg font-bold text-royal-300 tracking-wider">
                         {claimedOffer.couponCode}
                       </div>
                       {claimedOffer.copied && (
                         <p className="text-green-400 text-xs mt-1 flex items-center justify-center gap-1">
                           <Copy className="w-3 h-3" />
                           Copied!
                         </p>
                       )}
                     </div>
                   </div>
                   
                   {/* Discount Badge - Compact */}
                   <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg p-2 border border-green-500/30 shadow-lg animate-[fadeInRight_0.5s_ease-out_0.7s_both]">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                         <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                           <Gift className="w-3 h-3 text-white" />
                         </div>
                         <span className="text-xs text-green-300">Discount</span>
                       </div>
                       <span className="text-base font-bold text-green-300">{claimedOffer.discount}</span>
                     </div>
                   </div>
                 </div>
                 
                 {/* Instructions - Compact */}
                 <div className="bg-royal-900/30 p-4 border-t border-royal-500/20 animate-[fadeInUp_0.8s_ease-out_0.8s_both]">
                   <h4 className="text-royal-300 font-medium mb-2 text-xs">How to use</h4>
                   <ol className="space-y-1 text-xs text-gray-300">
                     <li className="flex items-start gap-2">
                       <div className="w-4 h-4 bg-royal-800 rounded-full flex items-center justify-center text-xs text-royal-300 mt-0.5">1</div>
                       <span>Go to booking page</span>
                     </li>
                     <li className="flex items-start gap-2">
                       <div className="w-4 h-4 bg-royal-800 rounded-full flex items-center justify-center text-xs text-royal-300 mt-0.5">2</div>
                       <span>Enter coupon code</span>
                     </li>
                     <li className="flex items-start gap-2">
                       <div className="w-4 h-4 bg-royal-800 rounded-full flex items-center justify-center text-xs text-royal-300 mt-0.5">3</div>
                       <span>Enjoy discount!</span>
                     </li>
                   </ol>
                 </div>
                 
                 {/* Footer - Compact */}
                 <div className="p-3 border-t border-royal-500/20 flex justify-between items-center animate-[fadeInUp_0.8s_ease-out_1s_both]">
                   <div className="text-xs text-gray-400 flex items-center gap-1">
                     <Clock className="w-3 h-3" />
                     <span>Auto-closing in 6s</span>
                   </div>
                   
                   <div className="text-royal-300 text-xs">
                     {format(claimedOffer.claimTime, "dd MMM")}
                   </div>
                 </div>
               </div>
             </div>
           ) : (
             <div className="relative">
               {/* Confetti Animation */}
               <div className="absolute inset-0 pointer-events-none">
                 {[...Array(20)].map((_, i) => (
                   <div
                     key={i}
                     className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"
                     style={{
                       left: `${Math.random() * 100}%`,
                       top: `${Math.random() * 100}%`,
                       animationDelay: `${Math.random() * 2}s`,
                       animationDuration: `${1 + Math.random()}s`
                     }}
                   />
                 ))}
                 {[...Array(15)].map((_, i) => (
                   <div
                     key={i + 20}
                     className="absolute w-1 h-1 bg-gradient-to-r from-royal-400 to-purple-500 rounded-full animate-ping"
                     style={{
                       left: `${Math.random() * 100}%`,
                       top: `${Math.random() * 100}%`,
                       animationDelay: `${Math.random() * 3}s`,
                       animationDuration: `${0.5 + Math.random()}s`
                     }}
                   />
                 ))}
               </div>

               {/* Main Success Card */}
               <div className="bg-gradient-to-br from-luxury-800 to-luxury-900 border-2 border-royal-400 rounded-2xl p-8 max-w-md mx-4 text-center transform animate-[slideInUp_0.6s_ease-out] shadow-2xl">
                 {/* Success Icon with Pulse Animation */}
                 <div className="relative mb-6">
                   <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                     <Check className="w-10 h-10 text-white animate-[checkmark_0.8s_ease-in-out]" />
                   </div>
                   <div className="absolute inset-0 w-20 h-20 bg-green-400/30 rounded-full mx-auto animate-ping"></div>
                 </div>

                 {/* Success Message */}
                 <h3 className="text-2xl font-bold text-white mb-2 animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
                   🎉 Offer Claimed Successfully!
                 </h3>
                 
                 <p className="text-gray-300 mb-4 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
                   {claimedOffer.title}
                 </p>

                 {/* Coupon Code Display */}
                 <div className="bg-luxury-700 border border-royal-400 rounded-lg p-4 mb-4 animate-[fadeInUp_0.8s_ease-out_0.6s_both]">
                   <p className="text-sm text-gray-300 mb-2">Your coupon code:</p>
                   <div className="text-2xl font-mono font-bold text-royal-400 tracking-wider">
                     {claimedOffer.couponCode}
                   </div>
                   {claimedOffer.copied && (
                     <p className="text-green-400 text-sm mt-2 flex items-center justify-center gap-1">
                       <Copy className="w-4 h-4" />
                       Copied to clipboard!
                     </p>
                   )}
                 </div>

                 {/* Discount Badge */}
                 <div className="inline-flex items-center bg-gradient-to-r from-royal-600 to-purple-600 text-white px-6 py-2 rounded-full text-lg font-bold mb-4 animate-[bounceIn_1s_ease-out_0.8s_both]">
                   <Gift className="w-5 h-5 mr-2" />
                   {claimedOffer.discount}
                 </div>

                 {/* Instructions */}
                 <p className="text-sm text-gray-400 animate-[fadeInUp_0.8s_ease-out_1s_both]">
                   Use this code during booking to get your discount!
                 </p>

                 {/* Auto-close indicator */}
                 <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                   <Clock className="w-3 h-3" />
                   <span>Auto-closing in 4 seconds...</span>
                 </div>
               </div>

               {/* Floating particles */}
               <div className="absolute inset-0 pointer-events-none overflow-hidden">
                 {[...Array(8)].map((_, i) => (
                   <div
                     key={i}
                     className="absolute w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-70 animate-[float_3s_ease-in-out_infinite]"
                     style={{
                       left: `${10 + Math.random() * 80}%`,
                       top: `${10 + Math.random() * 80}%`,
                       animationDelay: `${Math.random() * 3}s`
                     }}
                   />
                 ))}
               </div>
             </div>
           )}
         </div>
       )}
       
       {/* Booking Confirmation Animation */}
       {showBookingConfirmation && bookingConfirmationDetails && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
           <div className="relative w-full max-w-xl">
             {/* Fireworks Animation */}
             <div className="absolute inset-0 pointer-events-none overflow-hidden">
               {/* Firework bursts */}
               {[...Array(15)].map((_, i) => (
                 <div key={`firework-${i}`} className="absolute">
                   {[...Array(12)].map((_, j) => (
                     <div
                       key={`spark-${i}-${j}`}
                       className="absolute h-1 w-20 origin-left"
                       style={{
                         left: `${Math.random() * 100}%`,
                         top: `${Math.random() * 100}%`,
                         transform: `rotate(${j * 30}deg)`,
                         opacity: 0,
                         animation: `firework-spark 0.8s ease-out ${i * 0.2}s forwards`
                       }}
                     >
                       <div 
                         className="h-full w-full rounded-full animate-ping"
                         style={{
                           background: `linear-gradient(90deg, 
                             ${['#FFD700', '#FF6B6B', '#4ECDC4', '#FF8C42', '#A06CD5', '#45B8AC'][i % 6]} 0%, 
                             transparent 100%)`
                         }}
                       />
                     </div>
                   ))}
                 </div>
               ))}
               
               {/* Floating stars */}
               {[...Array(30)].map((_, i) => (
                 <div
                   key={`star-${i}`}
                   className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                   style={{
                     left: `${Math.random() * 100}%`,
                     top: `${Math.random() * 100}%`,
                     animationDelay: `${Math.random() * 5}s`,
                     animationDuration: `${1 + Math.random() * 2}s`
                   }}
                 />
               ))}
             </div>

             {/* Main Confirmation Card */}
             <div className="bg-gradient-to-br from-luxury-900 via-luxury-800 to-luxury-900 border-2 border-royal-400/50 rounded-3xl overflow-hidden shadow-2xl animate-[zoomInFade_0.8s_ease-out]">
               {/* Header with confetti */}
               <div className="relative bg-gradient-to-r from-royal-600 to-purple-600 py-6 px-8 overflow-hidden">
                 {/* Animated confetti in header */}
                 {[...Array(20)].map((_, i) => (
                   <div
                     key={`header-confetti-${i}`}
                     className="absolute w-2 h-2 rounded-full animate-float-confetti"
                     style={{
                       backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#FF8C42', '#A06CD5'][i % 5],
                       left: `${Math.random() * 100}%`,
                       top: `${Math.random() * 100}%`,
                       animationDelay: `${Math.random() * 5}s`,
                       animationDuration: `${3 + Math.random() * 2}s`
                     }}
                   />
                 ))}
                 
                 {/* Success checkmark */}
                 <div className="flex items-center justify-center mb-2">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg animate-[bounceIn_0.6s_ease-out]">
                     <Check className="w-10 h-10 text-green-500 animate-[checkmark_0.8s_ease-in-out]" />
                   </div>
                 </div>
                 
                 <h2 className="text-2xl font-bold text-white text-center animate-[fadeInUp_0.8s_ease-out_0.3s_both]">
                   Booking Confirmed!
                 </h2>
                 
                 <div className="text-center mt-2 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
                   <span className="inline-block bg-white/20 text-white text-xs py-1 px-3 rounded-full">
                     Confirmation #{bookingConfirmationDetails.confirmationNumber}
                   </span>
                 </div>
               </div>
               
               {/* Property details */}
               <div className="p-6 animate-[fadeInUp_0.8s_ease-out_0.5s_both]">
                 <div className="flex items-center gap-4 mb-6">
                   <div className="relative">
                     <img 
                       src={bookingConfirmationDetails.property.image} 
                       alt={bookingConfirmationDetails.property.name}
                       className="w-20 h-20 rounded-xl object-cover ring-2 ring-royal-400/30"
                     />
                     <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center border-2 border-white">
                       <Check className="w-3 h-3 text-white" />
                     </div>
                   </div>
                   <div>
                     <h3 className="font-bold text-white text-lg">
                       {bookingConfirmationDetails.property.name}
                     </h3>
                     <p className="text-gray-300 text-sm flex items-center gap-1">
                       <MapPin className="w-3 h-3" />
                       {bookingConfirmationDetails.property.location}
                     </p>
                   </div>
                 </div>
                 
                 {/* Booking details with animated reveal */}
                 <div className="space-y-4">
                   {/* Room type */}
                   <div className="flex justify-between items-center animate-[fadeInRight_0.5s_ease-out_0.6s_both]">
                     <div className="flex items-center gap-2">
                       <div className="w-8 h-8 bg-royal-900/50 rounded-lg flex items-center justify-center">
                         <Home className="w-4 h-4 text-royal-400" />
                       </div>
                       <span className="text-gray-300">Room Type</span>
                     </div>
                     <span className="text-white font-medium">{bookingConfirmationDetails.roomType}</span>
                   </div>
                   
                   {/* Check-in */}
                   <div className="flex justify-between items-center animate-[fadeInRight_0.5s_ease-out_0.7s_both]">
                     <div className="flex items-center gap-2">
                       <div className="w-8 h-8 bg-royal-900/50 rounded-lg flex items-center justify-center">
                         <CalendarIcon className="w-4 h-4 text-royal-400" />
                       </div>
                       <span className="text-gray-300">Check-in</span>
                     </div>
                     <span className="text-white font-medium">{format(bookingConfirmationDetails.checkIn, "EEE, MMM d, yyyy")}</span>
                   </div>
                   
                   {/* Check-out */}
                   <div className="flex justify-between items-center animate-[fadeInRight_0.5s_ease-out_0.8s_both]">
                     <div className="flex items-center gap-2">
                       <div className="w-8 h-8 bg-royal-900/50 rounded-lg flex items-center justify-center">
                         <CalendarIcon className="w-4 h-4 text-royal-400" />
                       </div>
                       <span className="text-gray-300">Check-out</span>
                     </div>
                     <span className="text-white font-medium">{format(bookingConfirmationDetails.checkOut, "EEE, MMM d, yyyy")}</span>
                   </div>
                   
                   {/* Duration */}
                   <div className="flex justify-between items-center animate-[fadeInRight_0.5s_ease-out_0.9s_both]">
                     <div className="flex items-center gap-2">
                       <div className="w-8 h-8 bg-royal-900/50 rounded-lg flex items-center justify-center">
                         <Clock className="w-4 h-4 text-royal-400" />
                       </div>
                       <span className="text-gray-300">Duration</span>
                     </div>
                     <span className="text-white font-medium">{bookingConfirmationDetails.nights} nights</span>
                   </div>
                 </div>
               </div>
               
               {/* Payment summary */}
               <div className="bg-royal-900/30 p-6 border-t border-royal-500/20 animate-[fadeInUp_0.8s_ease-out_1s_both]">
                 <h4 className="text-royal-300 font-medium mb-4">Payment Summary</h4>
                 
                 <div className="space-y-2">
                   {bookingConfirmationDetails.discount > 0 && (
                     <>
                       <div className="flex justify-between text-sm">
                         <span className="text-gray-400">Original Price</span>
                         <span className="text-gray-400 line-through">₹{bookingConfirmationDetails.originalPrice.toLocaleString()}</span>
                       </div>
                       
                       <div className="flex justify-between text-sm">
                         <span className="text-green-400">
                           Discount
                           {bookingConfirmationDetails.coupon && (
                             <span className="ml-1">({bookingConfirmationDetails.coupon.code})</span>
                           )}
                         </span>
                         <span className="text-green-400">-₹{bookingConfirmationDetails.discount.toLocaleString()}</span>
                       </div>
                     </>
                   )}
                   
                   <div className="flex justify-between pt-2 border-t border-royal-500/20">
                     <span className="text-white font-medium">Total Amount</span>
                     <span className="text-xl font-bold bg-gradient-to-r from-royal-400 to-purple-400 bg-clip-text text-transparent">
                       ₹{bookingConfirmationDetails.price.toLocaleString()}
                     </span>
                   </div>
                 </div>
               </div>
               
               {/* Footer with auto-close and download option */}
               <div className="p-6 border-t border-royal-500/20 flex justify-between items-center animate-[fadeInUp_0.8s_ease-out_1.2s_both]">
                 <div className="text-xs text-gray-400 flex items-center gap-1">
                   <Clock className="w-3 h-3" />
                   <span>Auto-closing in 8 seconds</span>
                 </div>
                 
                 <div className="flex items-center gap-2">
                   <div className="text-royal-300 text-sm flex items-center gap-1 animate-pulse">
                     <span>Booking ID: {bookingConfirmationDetails.bookingId}</span>
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

export default ExploreStays;