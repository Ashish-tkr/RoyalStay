import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

const tourSpots = [
  {
    id: 1,
    name: 'Royal Villa Lobby',
    description: 'Step into luxury with our grand entrance and reception area',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 2,
    name: 'Infinity Pool',
    description: 'Experience our stunning infinity pool with panoramic mountain views',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 3,
    name: 'Luxury Suite',
    description: 'Discover the epitome of comfort in our spacious luxury suites',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  }
];

const VirtualTour = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVirtualTour, setShowVirtualTour] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % tourSpots.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + tourSpots.length) % tourSpots.length);
  };

  const toggleAutoplay = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle autoplay
  React.useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (isPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const handleStartVirtualTour = () => {
    setShowVirtualTour(true);
    // In a real app, this would initialize a 360 viewer
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-luxury-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-royal-900/50 rounded-full px-4 py-2 mb-6 border border-royal-700">
            <Eye className="w-5 h-5 text-royal-400 mr-2" />
            <span className="text-royal-300 text-sm font-medium">Interactive Experience</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Virtual <span className="gradient-text">Tour</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our luxurious properties from the comfort of your home with our immersive virtual tours
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden luxury-card">
          {/* Main Image */}
          <div className="relative aspect-video">
            <img 
              src={tourSpots[currentIndex].image}
              alt={tourSpots[currentIndex].name}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            
            {/* Tour Spot Info */}
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="text-3xl font-bold text-white mb-2">
                {tourSpots[currentIndex].name}
              </h3>
              <p className="text-gray-300 max-w-lg">
                {tourSpots[currentIndex].description}
              </p>
            </div>
            
            {/* Virtual Tour Button */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Button 
                size="lg"
                onClick={handleStartVirtualTour}
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-full w-16 h-16 flex items-center justify-center"
              >
                <Eye className="w-8 h-8" />
              </Button>
            </div>
            
            {/* Navigation Controls */}
            <div className="absolute bottom-8 right-8 flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={prevSlide}
                className="bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white rounded-full w-10 h-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleAutoplay}
                className="bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white rounded-full w-10 h-10"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={nextSlide}
                className="bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white rounded-full w-10 h-10"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>
          
          {/* Tour Spots Navigation */}
          <div className="flex overflow-x-auto p-4 gap-4 bg-luxury-800 scrollbar-hide">
            {tourSpots.map((spot, index) => (
              <div 
                key={spot.id}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 cursor-pointer transition-all duration-300 ${
                  index === currentIndex 
                    ? 'opacity-100 scale-105 ring-2 ring-royal-400' 
                    : 'opacity-70 hover:opacity-90'
                }`}
              >
                <div className="w-40 h-24 relative rounded-lg overflow-hidden">
                  <img 
                    src={spot.image}
                    alt={spot.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-sm font-medium truncate">{spot.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            size="lg"
            onClick={handleStartVirtualTour}
            className="bg-royal-gradient hover:shadow-lg hover:shadow-royal-500/25 px-8"
          >
                         <Eye className="w-5 h-5 mr-2" />
            Start Full Virtual Tour
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VirtualTour; 