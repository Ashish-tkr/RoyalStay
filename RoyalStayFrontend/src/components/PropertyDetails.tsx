import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bed, 
  Bath, 
  Users, 
  Home, 
  Utensils, 
  Dumbbell, 
  Wifi, 
  Car, 
  Tv, 
  Coffee, 
  AirVent,
  MapPin,
  Star,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// BHK configuration details
const bhkConfigs = {
  'Single': {
    size: '350 sq.ft',
    maxGuests: 1,
    bedrooms: 1,
    bathrooms: 1,
    price: 6500,
    originalPrice: 8000,
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    ],
    features: [
      'Queen-sized bed',
      'Compact refrigerator',
      'Work desk',
      'Smart TV',
      'High-speed WiFi',
      'Air conditioning',
      'En-suite bathroom',
      'Tea/coffee maker'
    ]
  },
  '1BHK': {
    size: '650 sq.ft',
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    price: 9500,
    originalPrice: 12000,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    ],
    features: [
      'Queen-sized bed',
      'Modern kitchenette',
      'Work desk',
      'Smart TV',
      'High-speed WiFi',
      'Air conditioning'
    ]
  },
  '2BHK': {
    size: '950 sq.ft',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    price: 15000,
    originalPrice: 18000,
    images: [
      'https://images.unsplash.com/photo-1598928636135-d146006ff4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    ],
    features: [
      'Master bedroom with king-sized bed',
      'Second bedroom with twin beds',
      'Full kitchen',
      'Dining area',
      'Living room with sofa',
      'Balcony',
      'Smart TVs in all rooms',
      'High-speed WiFi',
      'Air conditioning'
    ]
  },
  '3BHK': {
    size: '1350 sq.ft',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    price: 22000,
    originalPrice: 25000,
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    ],
    features: [
      'Master bedroom with king-sized bed and en-suite bathroom',
      'Second bedroom with queen-sized bed',
      'Third bedroom with twin beds',
      'Fully equipped kitchen',
      'Spacious dining area',
      'Large living room with sofa set',
      'Private terrace',
      'Smart TVs in all rooms',
      'High-speed WiFi',
      'Air conditioning throughout',
      'Washer and dryer'
    ]
  }
};

// Property amenities
const propertyAmenities = [
  { 
    name: 'Restaurant', 
    icon: <Utensils className="w-5 h-5 text-royal-400" />,
    description: 'Fine dining restaurant serving local and international cuisine'
  },
  { 
    name: 'Fitness Center', 
    icon: <Dumbbell className="w-5 h-5 text-royal-400" />,
    description: 'Modern gym with cardio and weight training equipment'
  },
  { 
    name: 'High-Speed WiFi', 
    icon: <Wifi className="w-5 h-5 text-royal-400" />,
    description: 'Complimentary high-speed internet throughout the property'
  },
  { 
    name: 'Parking', 
    icon: <Car className="w-5 h-5 text-royal-400" />,
    description: 'Free covered parking for all guests'
  },
  { 
    name: 'Entertainment', 
    icon: <Tv className="w-5 h-5 text-royal-400" />,
    description: 'Smart TVs with premium streaming services'
  },
  { 
    name: 'Coffee Shop', 
    icon: <Coffee className="w-5 h-5 text-royal-400" />,
    description: '24-hour coffee shop and lounge area'
  },
  { 
    name: 'Air Conditioning', 
    icon: <AirVent className="w-5 h-5 text-royal-400" />,
    description: 'Climate control in all rooms and common areas'
  }
];

interface PropertyDetailsProps {
  property: any;
  onClose: () => void;
  onBookNow: (property: any, bhkType: string) => void;
}

const PropertyDetails = ({ property, onClose, onBookNow }: PropertyDetailsProps) => {
  const [selectedBHK, setSelectedBHK] = useState('2BHK');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? bhkConfigs[selectedBHK as keyof typeof bhkConfigs].images.length - 1 : prev - 1
    );
  };
  
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      (prev + 1) % bhkConfigs[selectedBHK as keyof typeof bhkConfigs].images.length
    );
  };

  const handleBookNow = () => {
    // Create a modified property object with the selected BHK details
    const selectedConfig = bhkConfigs[selectedBHK as keyof typeof bhkConfigs];
    const bookingProperty = {
      ...property,
      name: `${property.name} - ${selectedBHK}`,
      price: selectedConfig.price,
      originalPrice: selectedConfig.originalPrice,
      bedrooms: selectedConfig.bedrooms,
      bathrooms: selectedConfig.bathrooms,
      guests: selectedConfig.maxGuests,
      image: selectedConfig.images[0]
    };
    
    onBookNow(bookingProperty, selectedBHK);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-luxury-900 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-luxury-900 border-b border-luxury-700">
          <h2 className="text-2xl font-bold text-white">{property.name}</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-luxury-800"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6">
          {/* Property Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-full md:w-2/3">
              <div className="relative rounded-xl overflow-hidden h-80">
                <img 
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center text-white mb-2">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span className="text-lg">{property.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                    <span className="text-white font-medium">{property.rating}</span>
                    <span className="text-gray-300 ml-1">({property.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/3 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-4">Property Overview</h3>
              <div className="luxury-card p-4 rounded-xl flex-grow">
                <div className="space-y-4">
                  <p className="text-gray-300">
                    Experience luxury living in our premium accommodations with world-class amenities and exceptional service.
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center text-gray-300">
                      <Home className="w-5 h-5 text-royal-400 mr-3" />
                      <span>Multiple BHK options available</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Utensils className="w-5 h-5 text-royal-400 mr-3" />
                      <span>On-site restaurant and dining</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Dumbbell className="w-5 h-5 text-royal-400 mr-3" />
                      <span>Modern fitness center</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* BHK Options */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">Select Your Accommodation</h3>
            
            <Tabs defaultValue="2BHK" value={selectedBHK} onValueChange={setSelectedBHK} className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="Single" className="data-[state=active]:bg-royal-600">Single Room</TabsTrigger>
                <TabsTrigger value="1BHK" className="data-[state=active]:bg-royal-600">1 BHK</TabsTrigger>
                <TabsTrigger value="2BHK" className="data-[state=active]:bg-royal-600">2 BHK</TabsTrigger>
                <TabsTrigger value="3BHK" className="data-[state=active]:bg-royal-600">3 BHK</TabsTrigger>
              </TabsList>
              
              {Object.entries(bhkConfigs).map(([bhkType, config]) => (
                <TabsContent key={bhkType} value={bhkType} className="mt-0">
                  <div className="luxury-card rounded-xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                      {/* Image Carousel */}
                      <div className="relative rounded-xl overflow-hidden h-80">
                        {config.images.map((image, index) => (
                          <div 
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-500 ${
                              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                          >
                            <img 
                              src={image}
                              alt={`${bhkType} - Image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        
                        {/* Image Navigation */}
                        <div className="absolute inset-0 flex items-center justify-between px-4">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={handlePrevImage}
                            className="bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={handleNextImage}
                            className="bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </Button>
                        </div>
                        
                        {/* Image Indicators */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                          {config.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Details */}
                      <div className="flex flex-col">
                        <h4 className="text-xl font-bold text-white mb-4">{bhkType} Details</h4>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center text-gray-300">
                            <Home className="w-5 h-5 text-royal-400 mr-2" />
                            <span>{config.size}</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Users className="w-5 h-5 text-royal-400 mr-2" />
                            <span>Up to {config.maxGuests} guests</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Bed className="w-5 h-5 text-royal-400 mr-2" />
                            <span>{config.bedrooms} {config.bedrooms > 1 ? 'bedrooms' : 'bedroom'}</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Bath className="w-5 h-5 text-royal-400 mr-2" />
                            <span>{config.bathrooms} {config.bathrooms > 1 ? 'bathrooms' : 'bathroom'}</span>
                          </div>
                        </div>
                        
                        <h5 className="font-medium text-white mb-2">Features:</h5>
                        <ul className="text-gray-300 text-sm mb-6 space-y-1">
                          {config.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-royal-400 mr-2">•</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="mt-auto">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-bold text-white">₹{config.price.toLocaleString()}</span>
                            {config.originalPrice > config.price && (
                              <span className="text-gray-400 text-sm line-through">₹{config.originalPrice.toLocaleString()}</span>
                            )}
                            <span className="text-gray-400 text-sm">/night</span>
                          </div>
                          
                          <Button 
                            className="w-full bg-royal-gradient hover:shadow-lg hover:shadow-royal-500/25"
                            onClick={handleBookNow}
                          >
                            Book {bhkType} Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          {/* Property Amenities */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">Property Amenities</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {propertyAmenities.map((amenity, index) => (
                <div 
                  key={index}
                  className="luxury-card p-4 rounded-xl flex items-start gap-3"
                >
                  <div className="mt-1">{amenity.icon}</div>
                  <div>
                    <h4 className="font-medium text-white">{amenity.name}</h4>
                    <p className="text-gray-400 text-sm">{amenity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end mt-8">
            <Button 
              variant="outline"
              onClick={onClose}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 mr-4"
            >
              Close
            </Button>
            <Button 
              className="bg-royal-gradient hover:shadow-lg hover:shadow-royal-500/25"
              onClick={handleBookNow}
            >
              Book {selectedBHK} Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails; 