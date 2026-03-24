import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Users, Square, Bath, Home, CheckCircle2 } from 'lucide-react';
import { useBooking } from '@/hooks/use-booking';

// Define the types directly in the component
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

interface RoomSelectionModalProps {
  open: boolean;
  apartment?: Apartment | null;
  flat?: FlatType | null;
}

export function RoomSelectionModal({ open, apartment, flat }: RoomSelectionModalProps) {
  const { setStep, setSelectedRoom, closeBooking ,setSelectedFlat} = useBooking();
  const [selectedFlatId, setSelectedFlatId] = useState<string>('');

  const handleFlatSelect = (flat: FlatType) => {
    // Convert flat to room type format expected by the booking system
    const roomType = {
      id: flat._id || flat.type,
      name: flat.title,
      description: flat.description || `${flat.type} apartment`,
      price: `₹${flat.price.toLocaleString()}`,
      numericPrice: flat.price, // Add numeric price for calculations
      features: flat.features || [],
      maxGuests: flat.maxOccupancy || 2,
      area: flat.size || 'Not specified',
      icon: <Home className="h-6 w-6" />,
      flatData: flat // Store the original flat data for later use
    };
    setSelectedFlat(flat); // Set the selected flat in the booking context
    setSelectedRoom(roomType);
    setStep('privacy');
  };

  const handleClose = () => {
    closeBooking();
  };

  // If no apartment data is available, show a loading state or message
  if (!apartment || !apartment.flats || apartment.flats.length === 0) {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-amber-800">
              No Flats Available
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-gray-600">Sorry, there are no flats available for selection.</p>
            <Button onClick={handleClose} className="mt-4">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-amber-800">
            Choose Your Flat at {apartment.name}
          </DialogTitle>
          <p className="text-center text-gray-600 mt-2">
            Select the perfect flat for your stay in {apartment.location}
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {apartment.flats.map((flat) => (
            <Card
              key={flat._id || flat.type}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                selectedFlatId === (flat._id || flat.type)
                  ? 'ring-2 ring-amber-500 bg-amber-50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedFlatId(flat._id || flat.type)}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                    <Home className="h-6 w-6" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  {flat.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {flat.type} • {flat.size || 'Size not specified'}
                </CardDescription>
                <div className="text-2xl font-bold text-amber-600 mt-2">
                  ₹{flat.price.toLocaleString()}<span className="text-sm text-gray-500">/night</span>
                </div>
                {flat.baseprice && flat.baseprice > flat.price && (
                  <div className="text-sm text-gray-500 line-through">
                    ₹{flat.baseprice.toLocaleString()}
                  </div>
                )}
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">Up to {flat.maxOccupancy || 2} guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Bed className="h-4 w-4" />
                      <span className="text-sm">{flat.bedrooms || 1} bed{(flat.bedrooms || 1) > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Bath className="h-4 w-4" />
                      <span className="text-sm">{flat.bathrooms || 1} bath{(flat.bathrooms || 1) > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  {flat.features && flat.features.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-800">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {flat.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {flat.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{flat.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {flat.amenities && flat.amenities.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-800">Amenities:</h4>
                      <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                        {flat.amenities.slice(0, 4).map((amenity, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span>{amenity}</span>
                          </div>
                        ))}
                        {flat.amenities.length > 4 && (
                          <div className="col-span-2 text-xs text-gray-500">
                            +{flat.amenities.length - 4} more amenities
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {flat.rating && flat.rating > 0 && (
                    <div className="flex items-center justify-center gap-1 text-sm text-amber-600 mt-2">
                      <span className="font-medium">★ {flat.rating}</span>
                      <span className="text-gray-500">
                        ({flat.reviews || 0} review{(flat.reviews || 0) !== 1 ? 's' : ''})
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button
            onClick={() => {
              const selectedFlat = apartment.flats.find(flat => 
                (flat._id || flat.type) === selectedFlatId
              );
              if (selectedFlat) {
                handleFlatSelect(selectedFlat);
              }
            }}
            disabled={!selectedFlatId}
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg font-medium"
          >
            Continue with {apartment.flats.find(flat => 
              (flat._id || flat.type) === selectedFlatId
            )?.title || 'Selected Flat'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}