import { useState, useEffect } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, MapPin, Home, CalendarIcon, Tag, X, Check } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useBooking } from '@/hooks/use-booking';

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

function computeApartmentData(apartment: Apartment): Apartment {
  if (!apartment.flats || apartment.flats.length === 0) return apartment;

  const cheapest = apartment.flats.reduce((prev, curr) =>
    curr.price < prev.price ? curr : prev
  );

  return {
    ...apartment,
    minPrice: cheapest.price,
    minBasePrice: cheapest.baseprice,
    cheapestFlat: cheapest,
  };
}

// Featured stays data
const stays = [
  {
    id: 1,
    name: 'Luxury Apartment',
    location: 'Koramangala, Bangalore',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    price: 9500,
    rating: 4.9,
    reviews: 128,
    amenities: ['WiFi', 'Pool', 'Gym', 'Parking'],
    bhkOptions: ['Single', '1BHK', '2BHK']
  },
  {
    id: 2,
    name: 'Premium Villa',
    location: 'Indiranagar, Bangalore',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    price: 15000,
    rating: 4.8,
    reviews: 96,
    amenities: ['WiFi', 'Garden', 'BBQ', 'Parking'],
    bhkOptions: ['2BHK', '3BHK']
  },
  {
    id: 3,
    name: 'Modern Studio',
    location: 'HSR Layout, Bangalore',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    price: 6500,
    rating: 4.7,
    reviews: 74,
    amenities: ['WiFi', 'Workspace', 'AC', 'Laundry'],
    bhkOptions: ['Single', '1BHK']
  },
  {
    id: 3,
    name: 'Modern Studio',
    location: 'HSR Layout, Bangalore',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    price: 6500,
    rating: 4.7,
    reviews: 74,
    amenities: ['WiFi', 'Workspace', 'AC', 'Laundry'],
    bhkOptions: ['Single', '1BHK']
  },

];

// Available coupon codes
const availableCoupons = [
  { code: 'WELCOME10', discount: 10, type: 'percent' },
  { code: 'LUXURY2000', discount: 2000, type: 'fixed' },
  { code: 'SUMMER25', discount: 25, type: 'percent' },
  { code: 'FIRSTBOOKING', discount: 15, type: 'percent' }
];

const FeaturedStays = () => {
  const { openBooking } = useBooking();
  const [apartments, setApartments] = useState<Apartment[]>([]);

  useEffect(() => {
    axios
      .get<Apartment[]>("http://localhost:5000/api/apartments")
      .then((res) => {
        // take only first 3 as "featured"
        const featured = res.data.slice(0, 3).map(computeApartmentData);
        setApartments(featured);
      })
      .catch((err) => console.error(err));
  }, []);


  const handleBookNow = (apartment: Apartment) => {
    openBooking({
      propertyName: apartment.name,
      propertyImage: apartment.coverImage,
      initialDateRange: {
      from: new Date(),
      to: addDays(new Date(), 7)
      }
    });
  };

  return (
    <section id="stays" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Featured <span className="gradient-text">Luxury Stays</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Handpicked accommodations that embody the essence of luxury and comfort
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {apartments.map((apt, index) => (
            <div 
              key={apt._id}
              className="luxury-card rounded-xl overflow-hidden hover-lift group animate-scale-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={apt.coverImage}
                  alt={apt.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <div className="glass-morphism px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-medium">{apt.rating}</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center text-white">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{apt.location}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">{apt.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{apt.reviews} reviews</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {apt.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-3 py-1 bg-royal-900/30 text-royal-300 text-xs rounded-full border border-royal-700"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-white">₹{apt.minPrice.toLocaleString()}</span>
                    <span className="text-gray-400 text-sm">/night</span>
                  </div>
                  <Link to="/explore-stays">
                  <Button 
                    size="sm"
                    className="bg-royal-gradient hover:shadow-lg hover:shadow-royal-500/25 transition-all duration-300"
                    
                  >
                    Book Now
                  </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/explore-stays">
            <Button 
              variant="outline"
              size="lg"
              className="border-royal-400 text-royal-400 hover:bg-royal-400 hover:text-luxury-950 px-8 py-4 h-auto font-semibold"
            >
              Explore All Stays
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStays;
