
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tag, Clock, Users, Calendar } from 'lucide-react';

const offers = [
  {
    id: 1,
    title: 'Early Bird Special',
    discount: '10% OFF',
    description: 'Book 30 days in advance and save big on your luxury stay',
    validUntil: '2024-12-31',
    terms: 'Valid for bookings made 30 days in advance',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
    category: 'Advance Booking'
  },
  {
    id: 2,
    title: 'Extended Stay Luxury',
    discount: '10% OFF',
    description: 'Stay 7 nights or more and enjoy exclusive extended stay rates',
    validUntil: '2024-11-30',
    terms: 'Minimum 7 nights stay required',
    image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80',
    category: 'Long Stay'
  },
  {
    id: 3,
    title: 'Couple\'s Retreat',
    discount: '10% OFF',
    description: 'Romantic getaway package with complimentary spa and dining',
    validUntil: '2024-12-14',
    terms: 'Valid for 2 guests only. Includes spa and dinner.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: 'Romance'
  },
  {
    id: 4,
    title: 'Family Fun Package',
    discount: '10% OFF',
    description: 'Perfect for families with kids activities and dining included',
    validUntil: '2024-12-25',
    terms: 'Valid for families with children under 12',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: 'Family'
  },
  {
    id: 5,
    title: 'Last Minute Deals',
    discount: '10% OFF',
    description: 'Book within 48 hours of check-in for maximum savings',
    validUntil: '2024-10-31',
    terms: 'Must book within 48 hours of arrival',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: 'Last Minute'
  },
  {
    id: 6,
    title: 'Seasonal Special',
    discount: '10% OFF',
    description: 'Limited time monsoon season offer with exclusive amenities',
    validUntil: '2024-09-30',
    terms: 'Valid during monsoon season only',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: 'Seasonal'
  }
];

const Offers = () => {
  return (
    <div className="min-h-screen bg-luxury-950">
      <Navbar />
      
      {/* Header Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            Exclusive <span className="gradient-text">Offers & Deals</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover incredible savings on luxury accommodations with our handpicked offers and seasonal deals
          </p>
        </div>
      </section>

      {/* Featured Offer Banner */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="luxury-card rounded-2xl overflow-hidden bg-gradient-to-r from-royal-900 to-royal-700 relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative p-8 md:p-12 text-center">
              <div className="inline-flex items-center bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold mb-4">
                <Tag className="w-4 h-4 mr-2" />
                LIMITED TIME OFFER
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Up to 40% OFF Luxury Stays 
              </h2>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                Book your dream vacation now and save big on premium accommodations across all destinations
              </p>
              <Button 
                size="lg"
                className="bg-white text-royal-900 hover:bg-gray-100 px-8 py-4 h-auto font-semibold text-lg"
              >
                Explore All Deals
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((offer, index) => (
              <div 
                key={offer.id}
                className="luxury-card rounded-xl overflow-hidden hover-lift group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {offer.discount}
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="glass-morphism px-3 py-1 rounded-full text-white text-xs">
                      {offer.category}
                    </div>
                  </div>

                  {/* Title on Image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{offer.title}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {offer.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      Valid until {new Date(offer.validUntil).toLocaleDateString()}
                    </div>
                    <div className="flex items-start text-sm text-gray-400">
                      <Calendar className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{offer.terms}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-royal-gradient hover:shadow-lg hover:shadow-royal-500/25 transition-all duration-300"
                  >
                    Claim This Offer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-luxury-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Never Miss a <span className="gradient-text">Deal</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Subscribe to our newsletter and be the first to know about exclusive offers and flash sales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-royal-400"
            />
            <Button className="bg-royal-gradient px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Offers;
