
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Award, Users, MapPin, Clock } from 'lucide-react';

const stats = [
  { icon: Award, value: '500+', label: 'Luxury Properties' },
  { icon: Users, value: '10,000+', label: 'Happy Guests' },
  { icon: MapPin, value: '50+', label: 'Destinations' },
  { icon: Clock, value: '24/7', label: 'Support' }
];

const team = [
  {
    name: 'BALARAM BAGARTY',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Passionate about creating unforgettable luxury experiences'
  },
  {
    name: 'Priya Patel',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: 'Ensuring every stay meets our premium standards'
  },
  {
    name: 'Rajesh Kumar',
    role: 'Customer Experience Director',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    description: '24/7 dedicated to exceptional guest experiences'
  }
];

const About = () => {
  return (
    <div className="min-h-screen bg-luxury-950">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              About <span className="gradient-text">Sirinilaya</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Where luxury meets serenity, creating unforgettable experiences in the world's most beautiful destinations
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-16 h-16 bg-royal-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-luxury-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Founded with a vision to redefine luxury hospitality, Sirinilaya was born from the Sanskrit words 
                'Siri' meaning wealth and prosperity, and 'Nilaya' meaning home or dwelling. Together, they represent 
                our commitment to providing peaceful, luxurious homes away from home.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Since our inception, we've carefully curated a collection of the world's most extraordinary properties, 
                each selected for its unique character, exceptional service, and ability to create lasting memories.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Today, we continue to push the boundaries of luxury travel, ensuring every guest experiences 
                the perfect blend of comfort, elegance, and authentic local culture.
              </p>
            </div>
            <div className="animate-scale-in">
              <img 
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Luxury Resort"
                className="w-full h-96 object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="luxury-card p-8 rounded-2xl animate-slide-up">
              <h3 className="text-3xl font-bold mb-6 gradient-text">Our Mission</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                To create extraordinary luxury experiences that celebrate the finest in hospitality, 
                comfort, and cultural authenticity. We believe every journey should be transformative, 
                every stay should be memorable, and every guest should feel truly valued.
              </p>
            </div>
            <div className="luxury-card p-8 rounded-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-3xl font-bold mb-6 gradient-text">Our Vision</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                To be the world's most trusted luxury hospitality brand, setting new standards 
                for excellence while preserving the unique character and heritage of each destination 
                we serve. We envision a future where luxury travel is both responsible and transformative.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-luxury-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-300">
              The passionate individuals behind your extraordinary experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div 
                key={member.name}
                className="luxury-card p-6 rounded-xl text-center hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <img 
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-royal-400"
                />
                <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                <p className="text-royal-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
