
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    rating: 5,
    text: 'RoyalStay exceeded all our expectations. The attention to detail, luxurious amenities, and personalized service made our anniversary celebration truly magical. Every moment was crafted to perfection.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    stay: 'Royal Villa Retreat, Goa',
    date: 'March 2024'
  },
  {
    id: 2,
    name: 'Rahul Mehta',
    location: 'Delhi, India',
    rating: 5,
    text: 'The perfect blend of luxury and comfort. Every moment was curated to perfection. The staff went above and beyond to ensure our stay was unforgettable. Highly recommend for special occasions.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    stay: 'Mountain Palace Suite, Manali',
    date: 'February 2024'
  },
  {
    id: 3,
    name: 'Ananya Patel',
    location: 'Bangalore, India',
    rating: 5,
    text: 'From the moment we arrived, we felt like royalty. The properties are stunning, and the experiences are truly one-of-a-kind. The attention to detail is remarkable.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    stay: 'Desert Oasis Resort, Rajasthan',
    date: 'January 2024'
  },
  {
    id: 4,
    name: 'Vikram Singh',
    location: 'Pune, India',
    rating: 5,
    text: 'Outstanding service and breathtaking views. The concierge team helped us discover hidden gems in the area. Our family vacation was absolutely perfect thanks to RoyalStay.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    stay: 'Beachfront Paradise, Kerala',
    date: 'April 2024'
  },
  {
    id: 5,
    name: 'Meera Gupta',
    location: 'Chennai, India',
    rating: 5,
    text: 'The level of luxury and comfort exceeded our expectations. Every detail was thoughtfully arranged. The spa services were world-class, and the dining experience was exceptional.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    stay: 'Hill Station Cottage, Ooty',
    date: 'May 2024'
  },
  {
    id: 6,
    name: 'Arjun Reddy',
    location: 'Hyderabad, India',
    rating: 5,
    text: 'Business trip turned into a luxury experience. The amenities, location, and service quality made it an unforgettable stay. Will definitely book again for leisure trips.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    stay: 'Urban Luxury Suite, Mumbai',
    date: 'June 2024'
  }
];

const stats = [
  { value: '4.9/5', label: 'Average Rating' },
  { value: '10,000+', label: 'Happy Guests' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '95%', label: 'Return Guests' }
];

const TestimonialsPage = () => {
  return (
    <div className="min-h-screen bg-luxury-950">
      <Navbar />

      {/* Header Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            Guest <span className="gradient-text">Testimonials</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover what our valued guests say about their extraordinary experiences at RoyalStay
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="luxury-card p-8 rounded-2xl hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <Quote className="w-10 h-10 text-royal-400 mb-6 opacity-50" />

                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    "{testimonial.text}"
                  </p>

                  <div className="border-t border-luxury-700 pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-royal-400"
                        />
                        <div>
                          <h4 className="text-white font-semibold">
                            {testimonial.name}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {testimonial.location}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-royal-400 text-sm font-medium">
                          {testimonial.stay}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {testimonial.date}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-luxury-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Your Own <span className="gradient-text">Story</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied guests who have experienced the luxury of RoyalStay
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-royal-gradient px-8 py-4 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-royal-500/25 transition-all duration-300">
              Book Your Stay
            </button>
            <button className="border border-royal-400 text-royal-400 hover:bg-royal-400 hover:text-luxury-950 px-8 py-4 rounded-lg font-semibold transition-all duration-300">
              View Properties
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TestimonialsPage;
