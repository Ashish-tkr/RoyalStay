import { useState } from 'react';
import { Calendar, Home, Users, Building, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ApartmentDetailsDialog from './ApartmentDetailsDialog';
import { useNavigate } from 'react-router-dom';

const homeOptions = [
  {
    id: 1,
    title: 'Cozy 1BHK',
    description: 'Perfect for students and young professionals seeking comfort and convenience',
    icon: <Home className="w-6 h-6 text-royal-400" />,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    features: ['Fully furnished', 'Work-friendly setup', 'Prime locations', 'Flexible lease terms'],
    type: '1BHK'
  },
  {
    id: 2,
    title: 'Stylish 2BHK',
    description: 'Ideal for couples or small families looking for the perfect balance of space and luxury',
    icon: <Building className="w-6 h-6 text-royal-400" />,
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    features: ['Modern interiors', 'Dedicated workspace', 'Premium amenities', 'Concierge services'],
    type: '2BHK'
  },
  {
    id: 3,
    title: 'Spacious 3BHK',
    description: 'Luxurious living spaces for families seeking comfort without compromise',
    icon: <Users className="w-6 h-6 text-royal-400" />,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    features: ['Premium furnishings', 'Spacious living areas', 'Family-friendly', 'Prime neighborhoods'],
    type: '3BHK'
  },
  {
    id: 4,
    title: 'Single Room',
    description: 'Compact and comfortable accommodations perfect for solo travelers and students',
    icon: <Key className="w-6 h-6 text-royal-400" />,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    features: ['Queen bed', 'Compact refrigerator', 'Work desk', 'Smart TV', 'WiFi', 'AC', 'En-suite bathroom', 'Tea/coffee maker'],
    type: 'Single'
  }
];

const ExperienceSection = () => {
  const [selectedApartment, setSelectedApartment] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = (apartmentType: string) => {
    setSelectedApartment(apartmentType);
    setDialogOpen(true);
  };
  const handleBrowseAllHomes = () => {navigate('/explore-stays'); // Navigate first
    setTimeout(() => {
      const element = document.getElementById('stays-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100); // Slight delay to ensure page renders
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Find Your <span className="gradient-text">Perfect Home</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Discover homes that feel just right — from cozy 1BHKs to spacious 3BHKs, we offer thoughtfully designed living spaces tailored for your lifestyle. Whether you're a student, working professional, or moving in with family, our homes come fully furnished, move-in ready, and located in prime neighborhoods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {homeOptions.map((option) => (
            <div 
              key={option.id}
              className="luxury-card rounded-xl overflow-hidden group hover-lift"
            >
              <div className="flex flex-col h-full">
                <div className="relative h-64">
                  <img 
                    src={option.image}
                    alt={option.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-luxury-800/80 backdrop-blur-sm">
                        {option.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white">{option.title}</h3>
                    </div>
                    <p className="text-gray-300 line-clamp-2">{option.description}</p>
                  </div>
                </div>

                <div className="p-6 flex-grow">
                  <ul className="space-y-2 mb-4">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <span className="w-1.5 h-1.5 bg-royal-400 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-luxury-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-royal-400" />
                      <span className="text-gray-300">Move-in ready</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-royal-400 text-royal-400 hover:bg-royal-400 hover:text-luxury-950"
                      onClick={() => handleViewDetails(option.type)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
            Say goodbye to the stress of setup and hello to flexible stays, seamless booking, and effortless comfort. Find your next home with ease — live better, rent smarter.
          </p>
          
            <Button 
            onClick={handleBrowseAllHomes}
              size="lg"
              className="bg-royal-gradient hover:shadow-lg hover:shadow-royal-500/25 px-8 py-6 h-auto text-lg font-semibold"
            >
              Browse All Homes
            </Button>
         
        </div>
      </div>

      {/* Apartment Details Dialog */}
      {/* {selectedApartment && (
        <ApartmentDetailsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          apartmentType={selectedApartment}
        />
      )} */}
    </section>
  );
};

export default ExperienceSection; 