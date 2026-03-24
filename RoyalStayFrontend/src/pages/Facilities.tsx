import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Utensils, 
  Dumbbell, 
  Car, 
  Map, 
  Bed, 
  Home, 
  Sofa,
  Wifi,
  Bath,
  Coffee,
  Tv,
  AirVent,
  Waves,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Facility categories
const categories = [
  {
    id: 'dining',
    name: 'Dining',
    icon: <Utensils className="w-6 h-6 text-royal-400" />,
    description: 'Experience culinary excellence with our diverse dining options'
  },
  {
    id: 'fitness',
    name: 'Fitness & Wellness',
    icon: <Dumbbell className="w-6 h-6 text-royal-400" />,
    description: 'Stay active and rejuvenated with our premium fitness facilities'
  },
  {
    id: 'accommodation',
    name: 'Accommodation',
    icon: <Home className="w-6 h-6 text-royal-400" />,
    description: 'Choose from our range of luxurious BHK options'
  },
  {
    id: 'services',
    name: 'Services',
    icon: <Car className="w-6 h-6 text-royal-400" />,
    description: 'Enjoy convenient services to enhance your stay experience'
  },
  {
    id: 'activities',
    name: 'Activities & Excursions',
    icon: <Map className="w-6 h-6 text-royal-400" />,
    description: 'Explore and experience the best local attractions and adventures'
  }
];

// Dining facilities
const diningFacilities = [
  {
    name: 'Signature Restaurant',
    description: 'Our flagship fine dining restaurant offering authentic local cuisine and international favorites prepared by expert chefs.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    features: ['Fine Dining', 'Local & International Cuisine', 'Wine Selection', 'Private Dining Available']
  },
  {
    name: 'Rooftop Lounge',
    description: 'Enjoy breathtaking views while savoring handcrafted cocktails and gourmet appetizers in our elegant rooftop setting.',
    image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    features: ['Panoramic Views', 'Cocktails & Spirits', 'Live Music', 'Sunset Happy Hours']
  },
  {
    name: 'Café & Bakery',
    description: 'A cozy spot for freshly brewed coffee, artisanal teas, and homemade pastries throughout the day.',
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    features: ['Fresh Pastries', 'Specialty Coffee', 'All-Day Service', 'Grab & Go Options']
  },
  {
    name: 'In-Room Dining',
    description: 'Enjoy the convenience of our 24-hour in-room dining service with a special menu curated for a perfect dining experience in the comfort of your room.',
    image: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80',
    features: ['24-Hour Service', 'Special Menu', 'Private Dining', 'Customizable Options']
  }
];

// Fitness facilities
const fitnessFacilities = [
  {
    name: 'State-of-the-Art Gym',
    description: 'Our modern fitness center features the latest equipment for cardio, strength training, and functional workouts.',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    features: ['Latest Equipment', '24/7 Access', 'Personal Training Available', 'Towel Service']
  },
  {
    name: 'Yoga & Meditation Studio',
    description: 'Find your inner peace in our serene yoga studio with daily classes for all experience levels.',
    image: 'https://images.unsplash.com/photo-1588286840104-8457c3904df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    features: ['Daily Classes', 'Expert Instructors', 'Meditation Sessions', 'Mats & Props Provided']
  },
  {
    name: 'Swimming Pool',
    description: 'Relax and rejuvenate in our temperature-controlled infinity pool with stunning views.',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    features: ['Infinity Edge', 'Temperature Controlled', 'Loungers & Cabanas', 'Poolside Service']
  },
  {
    name: 'Spa & Wellness Center',
    description: 'Indulge in our range of therapeutic treatments and massages designed to relax and rejuvenate.',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    features: ['Massage Therapy', 'Facial Treatments', 'Aromatherapy', 'Couples Packages']
  }
];

// Accommodation options
const accommodationOptions = [
  {
    name: '1 BHK Luxury Apartment',
    description: 'Perfect for solo travelers or couples, our 1 BHK apartments offer comfort and luxury in a compact space.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    features: [
      'Queen-sized bed',
      '650 sq.ft area',
      'Modern kitchenette',
      'Smart TV',
      'High-speed WiFi',
      'Air conditioning',
      'Work desk'
    ],
    capacity: '2 Guests',
    price: '₹9,500 - ₹12,000 / night'
  },
  {
    name: '2 BHK Premium Apartment',
    description: 'Spacious accommodation for families or small groups with separate bedrooms and a fully equipped kitchen.',
    image: 'https://images.unsplash.com/photo-1598928636135-d146006ff4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    features: [
      'Master bedroom with king-sized bed',
      'Second bedroom with twin beds',
      '950 sq.ft area',
      'Full kitchen',
      'Dining area',
      'Living room with sofa',
      'Balcony',
      'Smart TVs in all rooms',
      'High-speed WiFi',
      'Air conditioning'
    ],
    capacity: '4 Guests',
    price: '₹15,000 - ₹18,000 / night'
  },
  {
    name: '3 BHK Executive Apartment',
    description: 'Our most luxurious offering with three spacious bedrooms, perfect for larger families or groups seeking premium comfort.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    features: [
      'Master bedroom with king-sized bed and en-suite bathroom',
      'Second bedroom with queen-sized bed',
      
      'Third bedroom with twin beds',
      '1350 sq.ft area',
      'Fully equipped kitchen',
      'Spacious dining area',
      'Large living room with sofa set',
      'Private terrace',
      'Smart TVs in all rooms',
      'High-speed WiFi',
      'Air conditioning throughout',
      'Washer and dryer'
    ],
    capacity: '6 Guests',
    price: '₹22,000 - ₹25,000 / night'
  }
];

// Services
const services = [
  {
    name: 'Cab & Transportation',
    description: 'Our dedicated transportation service ensures hassle-free travel during your stay with airport transfers and local sightseeing options.',
    image: 'https://images.unsplash.com/photo-1559941727-6fb446e7e8ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80',
    features: ['Airport Transfers', '24/7 Availability', 'Local Sightseeing', 'Luxury Vehicles']
  },
  {
    name: 'Concierge Services',
    description: 'Our attentive concierge team is available around the clock to assist with reservations, recommendations, and special requests.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    features: ['24-Hour Assistance', 'Local Recommendations', 'Reservation Services', 'Special Arrangements']
  },
  {
    name: 'Housekeeping',
    description: 'Enjoy daily housekeeping services to ensure your accommodation remains pristine throughout your stay.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    features: ['Daily Service', 'Linen Change', 'Evening Turndown', 'On-Demand Available']
  },
  {
    name: 'Business Center',
    description: 'Stay productive with our fully equipped business center offering printing, scanning, and meeting facilities.',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    features: ['Meeting Rooms', 'High-Speed Internet', 'Printing & Scanning', 'Technical Support']
  }
];

// Activities
const activities = [
  {
    name: 'Guided Tours',
    description: 'Explore the local attractions with our expert guides who provide insightful commentary and take you to hidden gems.',
    image: 'https://images.unsplash.com/photo-1528702748617-c64d49f918af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    features: ['Expert Local Guides', 'Customizable Itineraries', 'Historical Sites', 'Cultural Experiences']
  },
  {
    name: 'Adventure Activities',
    description: 'For thrill-seekers, we arrange various adventure activities including trekking, water sports, and more.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    features: ['Trekking', 'Water Sports', 'Rock Climbing', 'Safety Equipment Provided']
  },
  {
    name: 'Cultural Experiences',
    description: 'Immerse yourself in local culture with cooking classes, craft workshops, and traditional performances.',
    image: 'https://images.unsplash.com/photo-1511914678378-2906b1f69dcf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    features: ['Cooking Classes', 'Craft Workshops', 'Traditional Performances', 'Local Interaction']
  },
  {
    name: 'Wellness Retreats',
    description: 'Rejuvenate with our specialized wellness programs combining yoga, meditation, and holistic treatments.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2020&q=80',
    features: ['Yoga Sessions', 'Meditation', 'Ayurvedic Treatments', 'Personalized Programs']
  }
];

const FacilityCard = ({ facility, category }: { facility: any, category: string }) => {
  return (
    <div className="luxury-card rounded-xl overflow-hidden hover-lift group">
      <div className="relative overflow-hidden h-64">
        <img 
          src={facility.image}
          alt={facility.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-3 text-white">{facility.name}</h3>
        <p className="text-gray-300 text-sm mb-4">{facility.description}</p>
        
        {category === 'accommodation' && (
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-royal-400" />
            <span className="text-gray-300 text-sm">{facility.capacity}</span>
          </div>
        )}
        
        <div className="space-y-3 mb-4">
          {facility.features.slice(0, 4).map((feature: string, index: number) => (
            <div key={index} className="flex items-start">
              <span className="text-royal-400 mr-2">•</span>
              <span className="text-gray-300 text-sm">{feature}</span>
            </div>
          ))}
          {facility.features.length > 4 && (
            <div className="text-royal-400 text-sm">+ {facility.features.length - 4} more features</div>
          )}
        </div>
        
        {category === 'accommodation' && (
          <div className="text-lg font-bold text-royal-400 mb-4">
            {facility.price}
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full border-royal-400 text-royal-400 hover:bg-royal-400 hover:text-luxury-950"
        >
          Learn More
        </Button>
      </div>
    </div>
  );
};

const Facilities = () => {
  const [activeTab, setActiveTab] = React.useState('dining');
  
  const getFacilitiesByCategory = (category: string) => {
    switch (category) {
      case 'dining':
        return diningFacilities;
      case 'fitness':
        return fitnessFacilities;
      case 'accommodation':
        return accommodationOptions;
      case 'services':
        return services;
      case 'activities':
        return activities;
      default:
        return [];
    }
  };
  
  return (
    <div className="min-h-screen bg-luxury-950">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              Our <span className="gradient-text">Facilities</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience world-class amenities and services designed for your comfort and convenience
            </p>
          </div>
          
          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
            {categories.map((category) => (
              <div 
                key={category.id}
                className={`luxury-card p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                  activeTab === category.id ? 'border-2 border-royal-400' : 'hover:border-royal-400/50 border-2 border-transparent'
                }`}
                onClick={() => setActiveTab(category.id)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">{category.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{category.name}</h3>
                  <p className="text-gray-400 text-sm">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Facilities Content */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {getFacilitiesByCategory(activeTab).map((facility, index) => (
              <FacilityCard 
                key={index} 
                facility={facility}
                category={activeTab}
              />
            ))}
          </div>
          
          {/* CTA */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Ready to experience our amenities?</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/explore-stays">
                <Button size="lg" className="bg-royal-gradient hover:shadow-lg hover:shadow-royal-500/25">
                  Book Your Stay
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-royal-400 text-royal-400">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Facilities; 