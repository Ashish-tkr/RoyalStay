
import { Home, User, Calendar, Star } from 'lucide-react';

const features = [
  {
    icon: Home,
    title: 'Premium Properties',
    description: 'Carefully curated luxury accommodations that exceed expectations'
  },
  {
    icon: User,
    title: 'Personalized Service',
    description: '24/7 concierge support to make your stay unforgettable'
  },
  {
    icon: Calendar,
    title: 'Flexible Booking',
    description: 'Easy reservations with flexible cancellation policies'
  },
  {
    icon: Star,
    title: 'Exclusive Experiences',
    description: 'Access to unique local experiences and premium amenities'
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-luxury-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Why Choose <span className="gradient-text">Sirinilaya</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We don't just offer accommodations; we create extraordinary experiences 
            that celebrate luxury, comfort, and authentic hospitality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="luxury-card p-8 rounded-xl hover-lift group animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-royal-gradient rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
