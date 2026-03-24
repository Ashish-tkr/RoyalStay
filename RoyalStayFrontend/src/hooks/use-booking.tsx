// hooks/use-booking.tsx
import { useState, createContext, useContext } from 'react';
import { DateRange } from 'react-day-picker';

type BookingStep = 'room-selection' | 'privacy' | 'rules' | 'form' | 'confirmation';

// In use-booking.tsx
interface RoomType {
  id: string;
  name: string;
  description: string;
  price: string; // Formatted price (e.g., "₹2,999")
  numericPrice: number; // Add this for calculations
  features: string[];
  maxGuests: number;
  area: string;
  icon: React.ReactNode;
  flatData?: FlatType; // Store the original flat data
}

interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  arrivalTime: string;
  specialRequests?: string;
}

// Add these interfaces (same as in your dialog)
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

interface BookingContextType {
  isBookingOpen: boolean;
  currentStep: BookingStep;
  propertyName: string | undefined;
  propertyImage: string | undefined;
  initialDateRange: DateRange | undefined;
  selectedApartment: Apartment | null;
  selectedFlat: FlatType | null;
  selectedRoom: RoomType | null;
  bookingData: BookingData | null;
  openBooking: (options: {
    propertyName?: string;
    propertyImage?: string;
    initialDateRange?: DateRange;
    apartment?: Apartment;
    flat?: FlatType;
  }) => void;
  closeBooking: () => void;
  setStep: (step: BookingStep) => void;
  setSelectedRoom: (room: RoomType) => void;
  setSelectedFlat: (flat: FlatType | null) => void; // Add this function
  setBookingData: (data: BookingData) => void;
  clearBookingData: () => void;
  resetBookingFlow: () => void;
}
const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<BookingStep>('room-selection');
  const [propertyName, setPropertyName] = useState<string | undefined>(undefined);
  const [propertyImage, setPropertyImage] = useState<string | undefined>(undefined);
  const [initialDateRange, setInitialDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [selectedFlat, setSelectedFlat] = useState<FlatType | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  const openBooking = ({
    propertyName,
    propertyImage,
    initialDateRange,
    apartment,
    flat,
  }: {
    propertyName?: string;
    propertyImage?: string;
    initialDateRange?: DateRange;
    apartment?: Apartment;
    flat?: FlatType;
  }) => {
    setPropertyName(propertyName);
    setPropertyImage(propertyImage);
    setInitialDateRange(initialDateRange);
    setSelectedApartment(apartment || null);
    setSelectedFlat(flat || null);
    setCurrentStep('room-selection');
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
    setTimeout(() => setCurrentStep('room-selection'), 300);
  };

  const setStep = (step: BookingStep) => setCurrentStep(step);
  const clearBookingData = () => setBookingData(null);
  
  const resetBookingFlow = () => {
    setCurrentStep('room-selection');
    setSelectedRoom(null);
    setBookingData(null);
    setSelectedApartment(null);
    setSelectedFlat(null);
    setIsBookingOpen(false);
  };

  return (
    <BookingContext.Provider
      value={{
        isBookingOpen,
        currentStep,
        propertyName,
        propertyImage,
        initialDateRange,
        selectedApartment,
        selectedFlat,
        selectedRoom,
        bookingData,
        openBooking,
        closeBooking,
        setStep,
        setSelectedRoom,
        setSelectedFlat, // Add this function to the context value
        setBookingData,
        clearBookingData,
        resetBookingFlow,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}