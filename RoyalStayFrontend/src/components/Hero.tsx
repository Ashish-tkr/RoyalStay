import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import AnimatedWelcome from './AnimatedWelcome';
import { useBooking } from '@/hooks/use-booking';
import { addDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  // Array of background images for the slider
  const backgroundImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { openBooking } = useBooking();
  const navigate = useNavigate();

  // Effect for automatic image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

    const handleBookNowClick = () => {
    navigate('/explore-stays'); // Navigate first
    setTimeout(() => {
      const element = document.getElementById('stays-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100); // Slight delay to ensure page renders
  };

  const handleExploreClick = () => {
    openBooking({
      propertyName: "Luxury Stay",
      propertyImage: backgroundImages[currentImageIndex],
      initialDateRange: {
        from: new Date(),
        to: addDays(new Date(), 5)
      }
    });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Slider */}
      {backgroundImages.map((image, index) => (
        <div 
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url('${image}')`
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-luxury-950/80"></div>
        </div>
      ))}

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-royal-500/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-32 right-20 w-32 h-32 bg-royal-400/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Welcome to <AnimatedWelcome />
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-4 font-light">
            Peaceful • Luxurious • Unforgettable
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover exceptional stays where luxury meets tranquility. From boutique hotels to exclusive villas, 
            experience accommodations that redefine premium hospitality.
            
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-royal-gradient hover:shadow-xl hover:shadow-royal-500/30 text-lg px-8 py-4 h-auto font-semibold transition-all duration-300 transform hover:scale-105"
              onClick={handleBookNowClick}
            >
              Book Now
            </Button>
            <Button 
              onClick={() => navigate('/about')}
              variant="outline"
              size="lg"
              className="border-royal-400 text-royal-400 hover:bg-royal-400 hover:text-luxury-950 text-lg px-8 py-4 h-auto font-semibold transition-all duration-300"
            >
              Watch Our Story
            </Button>
          </div>
        </div>

        {/* Image Slider Indicators */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-6">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex ? 'bg-royal-400 w-6' : 'bg-gray-400/50'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-royal-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-royal-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
