
import { useState, useEffect } from 'react';
import { Star, Quote, ChevronUp, ChevronDown } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    rating: 5,
    text: 'RoyalStay exceeded all our expectations. The attention to detail, luxurious amenities, and personalized service made our anniversary celebration truly magical.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 2,
    name: 'Rahul Mehta',
    location: 'Delhi, India',
    rating: 5,
    text: 'The perfect blend of luxury and comfort. Every moment was curated to perfection. The staff went above and beyond to ensure our stay was unforgettable.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 3,
    name: 'Ananya Patel',
    location: 'Bangalore, India',
    rating: 5,
    text: 'From the moment we arrived, we felt like royalty. The properties are stunning, and the experiences are truly one-of-a-kind. Highly recommend!',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-luxury-900/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            What Our <span className="gradient-text">Guests</span> Say
          </h2>
          <p className="text-xl text-gray-300">
            Stories of exceptional experiences from our valued guests
          </p>
        </div>

        <div className="relative">
          <div className="luxury-card p-8 sm:p-12 rounded-2xl">
            <div className="relative">
              <Quote className="w-12 h-12 text-royal-400 mb-6 opacity-50" />

              <div
                key={currentIndex}
                className="animate-fade-in"
              >
                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-8">
                  "{testimonials[currentIndex].text}"
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                      className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-royal-400"
                    />
                    <div>
                      <h4 className="text-white font-semibold text-lg">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {testimonials[currentIndex].location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full glass-morphism hover:bg-royal-500/20 transition-colors duration-200"
            >
              <ChevronUp className="w-6 h-6 text-royal-400" />
            </button>

            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                      ? 'bg-royal-400 scale-125'
                      : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full glass-morphism hover:bg-royal-500/20 transition-colors duration-200"
            >
              <ChevronDown className="w-6 h-6 text-royal-400" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
