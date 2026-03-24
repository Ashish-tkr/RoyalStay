import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import WhyChooseUs from '@/components/WhyChooseUs';
import FeaturedStays from '@/components/FeaturedStays';
import Testimonials from '@/components/Testimonials';
import ExperienceSection from '@/components/ExperienceSection';
import VirtualTour from '@/components/VirtualTour';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-luxury-950">
      <Navbar />
      <Hero />
      <WhyChooseUs />
      <FeaturedStays />
      <ExperienceSection />
      <VirtualTour />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
