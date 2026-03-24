import { Bed, Users, Square, Wifi, Tv, Coffee, Bath, Utensils, Waves, Snowflake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBooking } from '@/hooks/use-booking';

export function RoomDetails() {
  const { openBooking } = useBooking();
  
  const roomTypes = [
    {
      id: 'single-room',
      name: 'Single Room',
      description: 'Perfect for solo travelers or couples seeking comfort and convenience.',
      price: '₹2,999',
      features: [
        '1 Queen Bed', 
        'City View', 
        'Free WiFi', 
        'Air Conditioning',
        'Smart TV',
        'En-suite Bathroom',
        'Room Service',
        'Daily Housekeeping'
      ],
      amenities: [
        { icon: <Wifi className="h-4 w-4" />, name: 'High-speed WiFi' },
        { icon: <Tv className="h-4 w-4" />, name: '43" Smart TV' },
        { icon: <Snowflake className="h-4 w-4" />, name: 'AC' },
        { icon: <Coffee className="h-4 w-4" />, name: 'Tea/Coffee Maker' },
        { icon: <Bath className="h-4 w-4" />, name: 'Premium Toiletries' }
      ],
      maxGuests: 2,
      area: '250 sq ft',
      bedType: '1 Queen Bed',
      icon: <Bed className="h-8 w-8" />,
      image: '/images/rooms/single-room.jpg'
    },
    {
      id: '1bhk',
      name: '1BHK Apartment',
      description: 'Spacious apartment with separate bedroom and living area for extended stays.',
      price: '₹4,999',
      features: [
        '1 Bedroom with King Bed', 
        'Separate Living Room', 
        'Kitchenette', 
        'Dining Area',
        'Work Desk',
        'Free WiFi',
        'Air Conditioning',
        'Smart TV',
        'Washing Machine'
      ],
      amenities: [
        { icon: <Utensils className="h-4 w-4" />, name: 'Kitchenette' },
        { icon: <Wifi className="h-4 w-4" />, name: 'High-speed WiFi' },
        { icon: <Tv className="h-4 w-4" />, name: '50" Smart TV' },
        { icon: <Snowflake className="h-4 w-4" />, name: 'AC' },
        { icon: <Waves className="h-4 w-4" />, name: 'Washing Machine' }
      ],
      maxGuests: 3,
      area: '450 sq ft',
      bedType: '1 King Bed',
      icon: <Square className="h-8 w-8" />,
      image: '/images/rooms/1bhk.jpg'
    },
    {
      id: '2bhk',
      name: '2BHK Apartment',
      description: 'Luxury apartment perfect for families or groups with all modern amenities.',
      price: '₹7,999',
      features: [
        '2 Bedrooms (1 King + 2 Singles)', 
        'Spacious Living Room', 
        'Full Kitchen', 
        'Dining Area',
        'Balcony with View',
        'Work Space',
        'Free WiFi',
        'Air Conditioning',
        'Smart TVs in All Rooms',
        'Washing Machine',
        'Dishwasher'
      ],
      amenities: [
        { icon: <Utensils className="h-4 w-4" />, name: 'Full Kitchen' },
        { icon: <Wifi className="h-4 w-4" />, name: 'High-speed WiFi' },
        { icon: <Tv className="h-4 w-4" />, name: 'Multiple Smart TVs' },
        { icon: <Snowflake className="h-4 w-4" />, name: 'AC' },
        { icon: <Waves className="h-4 w-4" />, name: 'Laundry Facilities' }
      ],
      maxGuests: 6,
      area: '750 sq ft',
      bedType: '1 King Bed + 2 Single Beds',
      icon: <Users className="h-8 w-8" />,
      image: '/images/rooms/2bhk.jpg'
    },
  ];

  const handleBookNow = (roomType: string) => {
    openBooking({});
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Accommodations
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose from our range of thoughtfully designed rooms and apartments, 
            each offering the perfect blend of comfort, luxury, and convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {roomTypes.map((room) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-video relative bg-gray-100">
                {room.image ? (
                  <img 
                    src={room.image} 
                    alt={room.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    {room.icon}
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-amber-600 hover:bg-amber-700 text-white">
                    {room.price}/night
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                    {room.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800">
                    {room.name}
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-600">
                  {room.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Up to {room.maxGuests} guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="h-4 w-4" />
                    <span>{room.area}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Room Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {room.features.slice(0, 6).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {room.features.length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{room.features.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <h4 className="font-medium text-gray-800 mb-2">Amenities:</h4>
                  <div className="flex flex-wrap gap-4">
                    {room.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-1 text-gray-600">
                        {amenity.icon}
                        <span className="text-xs">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={() => handleBookNow(room.id)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Book Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}