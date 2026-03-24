import { useState, useEffect, useRef } from 'react';
import { useBooking } from '@/hooks/use-booking';
import { addDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=85",
    headline: "Where Luxury",
    highlight: "Finds its Home",
    sub: "Timeless residences crafted for the discerning few",
  },
  {
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=85",
    headline: "Beyond the",
    highlight: "Ordinary",
    sub: "Experiences that redefine the meaning of exceptional",
  },
  {
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=85",
    headline: "Elevate Your",
    highlight: "Stay",
    sub: "Curated sanctuaries of comfort, culture & refinement",
  },
];

const STATS = [
  { value: '500+', label: 'Luxury Properties' },
  { value: '10K+', label: 'Happy Guests' },
  { value: '50+', label: 'Destinations' },
  { value: '24/7', label: 'Concierge' },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { openBooking } = useBooking();
  const navigate = useNavigate();

  const goToSlide = (index: number) => {
    if (transitioning || index === current) return;
    setPrev(current);
    setTransitioning(true);
    setCurrent(index);
    setTimeout(() => { setPrev(null); setTransitioning(false); }, 1000);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent(c => {
        const next = (c + 1) % SLIDES.length;
        setPrev(c);
        setTransitioning(true);
        setTimeout(() => { setPrev(null); setTransitioning(false); }, 1000);
        return next;
      });
    }, 6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleExplore = () => {
    navigate('/explore-stays');
  };

  const handleBookNow = () => {
    openBooking({
      propertyName: 'Royal Residences',
      propertyImage: SLIDES[current].image,
      initialDateRange: { from: new Date(), to: addDays(new Date(), 5) }
    });
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: '#0A0805' }}>

      {/* Slide Images */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: i === current ? 1 : 0,
            zIndex: i === current ? 1 : 0,
            transitionDuration: '1.2s',
            transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)',
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 transition-transform"
            style={{
              backgroundImage: `url('${slide.image}')`,
              transform: i === current ? 'scale(1.04)' : 'scale(1)',
              transitionDuration: '8s',
            }}
          />
          {/* Layered Overlays */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,8,5,0.82) 0%, rgba(10,8,5,0.45) 55%, rgba(10,8,5,0.2) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,8,5,0.9) 0%, transparent 50%)' }} />
          {/* Subtle grain overlay */}
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.4\'/%3E%3C/svg%3E")', backgroundSize: '200px' }} />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center flex-1 px-8 lg:px-24 pt-28 pb-20">
        <div className="max-w-3xl">

          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
            <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
            <span
              className="text-xs tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif", color: '#D4AF37', letterSpacing: '0.3em', opacity: 0.85 }}
            >
              Premium Collection 2024
            </span>
          </div>

          {/* Headline */}
          <h1
            className="mb-4 leading-none animate-fade-in-up"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              color: '#F5F0E6',
              lineHeight: 1.05,
              animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards'
            }}
          >
            {SLIDES[current].headline}
          </h1>
          <h1
            className="mb-8 leading-none animate-fade-in-up"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              fontStyle: 'italic',
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              background: 'linear-gradient(135deg, #D4AF37 0%, #F7E7CE 45%, #D4AF37 70%, #B8940F 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.05,
              animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards'
            }}
          >
            {SLIDES[current].highlight}
          </h1>

          {/* Subtitle */}
          <p
            className="mb-12 animate-fade-in-up"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 2vw, 1.3rem)',
              color: 'rgba(245, 240, 230, 0.6)',
              fontWeight: 300,
              letterSpacing: '0.05em',
              maxWidth: '42ch',
              animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards'
            }}
          >
            {SLIDES[current].sub}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}>
            <button
              onClick={handleExplore}
              className="flex items-center gap-3 transition-all duration-300 group"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #B8940F 100%)',
                color: '#0A0805',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                padding: '16px 36px',
                borderRadius: '2px',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(212, 175, 55, 0.45)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              Explore Stays
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              onClick={handleBookNow}
              className="flex items-center gap-3 transition-all duration-300 group"
              style={{
                background: 'transparent',
                color: 'rgba(212, 175, 55, 0.85)',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: '0.7rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                padding: '15px 35px',
                borderRadius: '2px',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212, 175, 55, 0.6)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(212, 175, 55, 0.07)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212, 175, 55, 0.3)';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div
        className="relative z-10 border-t"
        style={{ borderColor: 'rgba(212, 175, 55, 0.12)', background: 'rgba(10, 8, 5, 0.7)', backdropFilter: 'blur(16px)' }}
      >
        <div className="container mx-auto px-8 lg:px-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x"
            style={{ divideColor: 'rgba(212, 175, 55, 0.1)' }}>
            {STATS.map((stat, i) => (
              <div key={i} className="py-6 px-8 text-center animate-fade-in-up"
                style={{ animationDelay: `${0.6 + i * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: '1.8rem',
                    background: 'linear-gradient(135deg, #D4AF37, #F7E7CE)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs tracking-widest uppercase mt-1"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(245, 240, 230, 0.45)', letterSpacing: '0.2em' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-40 right-10 lg:right-24 z-20 flex flex-col gap-2 items-end">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className="transition-all duration-500 rounded-full"
            style={{
              width: i === current ? '32px' : '4px',
              height: '4px',
              background: i === current
                ? 'linear-gradient(90deg, #D4AF37, #F7E7CE)'
                : 'rgba(245, 240, 230, 0.25)',
            }}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs tracking-widest uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(212, 175, 55, 0.45)', letterSpacing: '0.25em', fontSize: '0.6rem' }}>
            Scroll
          </span>
          <ChevronDown size={16} style={{ color: 'rgba(212, 175, 55, 0.45)' }} />
        </div>
      </div>
    </section>
  );
};

export default Hero;


// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import AnimatedWelcome from './AnimatedWelcome';
// import { useBooking } from '@/hooks/use-booking';
// import { addDays } from 'date-fns';
// import { useNavigate } from 'react-router-dom';

// const Hero = () => {
//   // Array of background images for the slider
//   const backgroundImages = [
//     "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
//     "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
//     "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
//     "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
//   ];

//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const { openBooking } = useBooking();
//   const navigate = useNavigate();

//   // Effect for automatic image slider
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
//     }, 3000); // Change image every 3 seconds

//     return () => clearInterval(interval);
//   }, []);

//     const handleBookNowClick = () => {
//     navigate('/explore-stays'); // Navigate first
//     setTimeout(() => {
//       const element = document.getElementById('stays-section');
//       if (element) {
//         element.scrollIntoView({ behavior: 'smooth', block: 'start' });
//       }
//     }, 100); // Slight delay to ensure page renders
//   };

//   const handleExploreClick = () => {
//     openBooking({
//       propertyName: "Luxury Stay",
//       propertyImage: backgroundImages[currentImageIndex],
//       initialDateRange: {
//         from: new Date(),
//         to: addDays(new Date(), 5)
//       }
//     });
//   };

//   return (
//     <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
//       {/* Background Image Slider */}
//       {backgroundImages.map((image, index) => (
//         <div 
//           key={index}
//           className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
//             index === currentImageIndex ? 'opacity-100' : 'opacity-0'
//           }`}
//           style={{
//             backgroundImage: `url('${image}')`
//           }}
//         >
//           <div className="absolute inset-0 bg-black/60"></div>
//           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-luxury-950/80"></div>
//         </div>
//       ))}

//       {/* Floating Elements */}
//       <div className="absolute top-20 left-10 w-20 h-20 bg-royal-500/20 rounded-full blur-xl animate-float"></div>
//       <div className="absolute bottom-32 right-20 w-32 h-32 bg-royal-400/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>

//       {/* Content */}
//       <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
//         <div className="animate-fade-in">
//           <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
//             Welcome to <AnimatedWelcome />
//           </h1>
//           <p className="text-xl sm:text-2xl text-gray-300 mb-4 font-light">
//             Peaceful • Luxurious • Unforgettable
//           </p>
//           <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
//             Discover exceptional stays where luxury meets tranquility. From boutique hotels to exclusive villas, 
//             experience accommodations that redefine premium hospitality.
            
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//             <Button 
//               size="lg"
//               className="bg-royal-gradient hover:shadow-xl hover:shadow-royal-500/30 text-lg px-8 py-4 h-auto font-semibold transition-all duration-300 transform hover:scale-105"
//               onClick={handleBookNowClick}
//             >
//               Book Now
//             </Button>
//             <Button 
//               onClick={() => navigate('/about')}
//               variant="outline"
//               size="lg"
//               className="border-royal-400 text-royal-400 hover:bg-royal-400 hover:text-luxury-950 text-lg px-8 py-4 h-auto font-semibold transition-all duration-300"
//             >
//               Watch Our Story
//             </Button>
//           </div>
//         </div>

//         {/* Image Slider Indicators */}
//         <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-6">
//           {backgroundImages.map((_, index) => (
//             <button
//               key={index}
//               className={`w-2 h-2 rounded-full transition-all ${
//                 index === currentImageIndex ? 'bg-royal-400 w-6' : 'bg-gray-400/50'
//               }`}
//               onClick={() => setCurrentImageIndex(index)}
//             />
//           ))}
//         </div>

//         {/* Scroll Indicator */}
//         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
//           <div className="w-6 h-10 border-2 border-royal-400 rounded-full flex justify-center">
//             <div className="w-1 h-3 bg-royal-400 rounded-full mt-2 animate-pulse"></div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;
