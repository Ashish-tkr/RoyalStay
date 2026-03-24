import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  Bed, 
  Bath, 
  CheckCircle2, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { addDays } from 'date-fns';
import { useBooking } from '@/hooks/use-booking';

// Types for the apartment data
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

interface ApartmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apartment: Apartment;
}

const ApartmentDetailsDialog = ({ 
  open,
  onOpenChange,
  apartment
}: ApartmentDetailsDialogProps) => {
  const [currentFlatIndex, setCurrentFlatIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { openBooking } = useBooking();
  
  // Get the current flat
  const currentFlat = apartment.flats[currentFlatIndex];
  
  // If no flats are available, don't render the dialog
  if (!apartment.flats || apartment.flats.length === 0) return null;

// In ApartmentDetailsDialog.tsx
const handleBookNow = () => {
  // Close the current dialog
  onOpenChange(false);
  
  // Open the booking dialog with apartment data
  openBooking({
    propertyName: currentFlat.title,
    propertyImage: currentFlat.images[0] || apartment.coverImage,
    initialDateRange: {
      from: new Date(),
      to: addDays(new Date(), 7)
    },
    apartment: apartment, // Pass the apartment
    flat: currentFlat, // Pass the current flat
  });
};
  // Flat navigation handlers
  const handlePrevFlat = () => {
    setCurrentFlatIndex((prev) => 
      prev === 0 ? apartment.flats.length - 1 : prev - 1
    );
    setCurrentImageIndex(0); // Reset image index when changing flats
  };
  
  const handleNextFlat = () => {
    setCurrentFlatIndex((prev) => 
      (prev + 1) % apartment.flats.length
    );
    setCurrentImageIndex(0); // Reset image index when changing flats
  };
  
  // Image navigation handlers
  const handlePrevImage = () => {
    if (currentFlat.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? currentFlat.images.length - 1 : prev - 1
      );
    }
  };
  
  const handleNextImage = () => {
    if (currentFlat.images.length > 0) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % currentFlat.images.length
      );
    }
  };

  // Get current image (fallback to apartment cover image if no flat images)
  const getCurrentImage = () => {
    if (currentFlat.images && currentFlat.images.length > 0) {
      return currentFlat.images[currentImageIndex];
    }
    return apartment.coverImage;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-luxury-900 border-luxury-700 text-white max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                {currentFlat.title}
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                {currentFlat.description || 'No description available'}
              </DialogDescription>
            </div>
            
            {/* Flat Navigation */}
            {apartment.flats.length > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={handlePrevFlat}
                  variant="outline"
                  size="sm"
                  className="border-luxury-700 bg-luxury-800 hover:bg-luxury-700 text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-400 min-w-[80px] text-center">
                  {currentFlatIndex + 1} of {apartment.flats.length}
                </span>
                <Button
                  onClick={handleNextFlat}
                  variant="outline"
                  size="sm"
                  className="border-luxury-700 bg-luxury-800 hover:bg-luxury-700 text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          
          {/* Flat Type Badge */}
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-royal-gradient px-3 py-1 rounded-full text-sm font-medium">
              {currentFlat.type}
            </span>
            <span className="text-gray-400 text-sm">
              at {apartment.name}, {apartment.location}
            </span>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
          {/* Image Gallery */}
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src={getCurrentImage()} 
              alt={currentFlat.title}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Image navigation arrows - only show if there are multiple images */}
            {currentFlat.images && currentFlat.images.length > 1 && (
              <>
                <button 
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button 
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
                
                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {currentFlat.images.length}
                </div>
              </>
            )}
          </div>
          
          {/* Details */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-luxury-800/50 p-4 rounded-lg border border-luxury-700">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-5 h-5 text-royal-400" />
                  <h3 className="font-medium">Size</h3>
                </div>
                <p className="text-gray-300">{currentFlat.size || 'Not specified'}</p>
              </div>
              
              <div className="bg-luxury-800/50 p-4 rounded-lg border border-luxury-700">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-royal-400" />
                  <h3 className="font-medium">Occupancy</h3>
                </div>
                <p className="text-gray-300">Up to {currentFlat.maxOccupancy || 1} guests</p>
              </div>
              
              <div className="bg-luxury-800/50 p-4 rounded-lg border border-luxury-700">
                <div className="flex items-center gap-2 mb-2">
                  <Bed className="w-5 h-5 text-royal-400" />
                  <h3 className="font-medium">Bedrooms</h3>
                </div>
                <p className="text-gray-300">{currentFlat.bedrooms || 1} bedroom{(currentFlat.bedrooms || 1) > 1 ? 's' : ''}</p>
              </div>
              
              <div className="bg-luxury-800/50 p-4 rounded-lg border border-luxury-700">
                <div className="flex items-center gap-2 mb-2">
                  <Bath className="w-5 h-5 text-royal-400" />
                  <h3 className="font-medium">Bathrooms</h3>
                </div>
                <p className="text-gray-300">{currentFlat.bathrooms || 1} bathroom{(currentFlat.bathrooms || 1) > 1 ? 's' : ''}</p>
              </div>
            </div>
            
            {/* Features Section */}
            {currentFlat.features && currentFlat.features.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {currentFlat.features.slice(0, 6).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-royal-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                  {currentFlat.features.length > 6 && (
                    <div className="text-sm text-royal-400">+ {currentFlat.features.length - 6} more</div>
                  )}
                </div>
              </div>
            )}
            
            {/* Flat Amenities Section */}
            {currentFlat.amenities && currentFlat.amenities.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Flat Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {currentFlat.amenities.slice(0, 6).map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-royal-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{amenity}</span>
                    </div>
                  ))}
                  {currentFlat.amenities.length > 6 && (
                    <div className="text-sm text-royal-400">+ {currentFlat.amenities.length - 6} more</div>
                  )}
                </div>
              </div>
            )}
            
            {/* Building Amenities Section */}
            {apartment.amenities && apartment.amenities.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Building Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {apartment.amenities.slice(0, 6).map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-royal-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{amenity}</span>
                    </div>
                  ))}
                  {apartment.amenities.length > 6 && (
                    <div className="text-sm text-royal-400">+ {apartment.amenities.length - 6} more</div>
                  )}
                </div>
              </div>
            )}
            
            {/* Rating Section */}
            {(currentFlat.rating || 0) > 0 && (
              <div className="bg-luxury-800/50 p-4 rounded-lg border border-luxury-700">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">★</span>
                  <span className="font-medium">{currentFlat.rating}/5</span>
                  <span className="text-gray-400 text-sm">
                    ({currentFlat.reviews || 0} review{(currentFlat.reviews || 0) !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>
            )}
            
            <div className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-white">₹{currentFlat.price.toLocaleString()}</span>
                  <span className="text-gray-400 text-sm">/night</span>
                  {currentFlat.baseprice && currentFlat.baseprice !== currentFlat.price && (
                    <div className="text-sm text-gray-500 line-through">
                      ₹{currentFlat.baseprice.toLocaleString()}
                    </div>
                  )}
                </div>
                <Button 
                  onClick={handleBookNow}
                  className="bg-royal-gradient hover:shadow-lg hover:shadow-royal-500/25"
                >
                  Book Now
                </Button>
              </div>
              <p className="text-sm text-gray-400">
                Price includes all taxes and fees. Minimum stay requirements may apply.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApartmentDetailsDialog;