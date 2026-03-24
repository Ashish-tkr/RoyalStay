import { Link } from 'react-router-dom';
import { Crown, Mail, Phone, MapPin, Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const navColumns = [
    {
      title: 'Discover',
      links: [
        { label: 'Explore Stays', href: '/explore-stays' },
        { label: 'Gallery', href: '/gallery' },
        { label: 'Facilities', href: '/facilities' },
        { label: 'Testimonials', href: '/testimonials' },
        { label: 'Offers & Deals', href: '/offers' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About RoyalStay', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Careers', href: '#' },
        { label: 'Press Room', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Centre', href: '#' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cancellation Policy', href: '#' },
        { label: 'Accessibility', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
  ];

  return (
    <footer style={{ background: '#080604', borderTop: '1px solid rgba(212, 175, 55, 0.1)' }}>

      {/* Main Footer */}
      <div className="container mx-auto px-8 lg:px-16 pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div
                className="w-10 h-10 rounded-sm flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B8940F 100%)', boxShadow: '0 0 20px rgba(212, 175, 55, 0.2)' }}
              >
                <Crown size={18} className="text-black" />
              </div>
              <div>
                <div
                  className="text-lg tracking-widest uppercase"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #D4AF37 0%, #F7E7CE 50%, #D4AF37 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  RoyalStay
                </div>
                <div
                  className="text-xs"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: 'italic',
                    color: 'rgba(212, 175, 55, 0.45)',
                    letterSpacing: '0.25em',
                    fontSize: '0.6rem',
                  }}
                >
                  Luxury Residences
                </div>
              </div>
            </Link>

            {/* Tagline */}
            <p
              className="mb-8 leading-relaxed"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: 'italic',
                color: 'rgba(245, 240, 230, 0.45)',
                fontSize: '1.05rem',
                fontWeight: 300,
                maxWidth: '30ch',
              }}
            >
              "Where every room tells a story of extraordinary comfort and timeless elegance."
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-8">
              {[
                { icon: Mail, text: 'hello@royalstay.com' },
                { icon: Phone, text: '+91 98765 43210' },
                { icon: MapPin, text: 'Mumbai, Maharashtra, India' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Icon size={14} style={{ color: 'rgba(212, 175, 55, 0.6)', flexShrink: 0 }} />
                  <span
                    className="text-xs"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(245, 240, 230, 0.45)', letterSpacing: '0.02em' }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-sm border transition-all duration-300"
                  style={{ borderColor: 'rgba(212, 175, 55, 0.2)', color: 'rgba(245, 240, 230, 0.5)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212, 175, 55, 0.5)';
                    (e.currentTarget as HTMLElement).style.color = '#D4AF37';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(212, 175, 55, 0.07)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212, 175, 55, 0.2)';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(245, 240, 230, 0.5)';
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          {navColumns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h4
                className="text-xs tracking-widest uppercase mb-6"
                style={{ fontFamily: "'DM Sans', sans-serif", color: '#D4AF37', letterSpacing: '0.25em', fontWeight: 600 }}
              >
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-xs transition-colors duration-300 group flex items-center gap-2"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: 'rgba(245, 240, 230, 0.45)',
                        letterSpacing: '0.04em',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(212, 175, 55, 0.8)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(245, 240, 230, 0.45)'; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Column */}
          <div className="lg:col-span-2">
            <h4
              className="text-xs tracking-widest uppercase mb-6"
              style={{ fontFamily: "'DM Sans', sans-serif", color: '#D4AF37', letterSpacing: '0.25em', fontWeight: 600 }}
            >
              Newsletter
            </h4>
            <p
              className="text-xs mb-5 leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(245, 240, 230, 0.4)', lineHeight: '1.7' }}
            >
              Receive curated offers and exclusive destinations for refined travelers.
            </p>

            {subscribed ? (
              <div
                className="text-xs py-3 text-center rounded-sm border"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: '#D4AF37',
                  borderColor: 'rgba(212, 175, 55, 0.3)',
                  background: 'rgba(212, 175, 55, 0.05)',
                  letterSpacing: '0.1em',
                }}
              >
                ✦ Thank you
              </div>
            ) : (
              <form onSubmit={handleSubscribe}>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full text-xs py-3 px-4 pr-10 rounded-sm border outline-none transition-all duration-300"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      background: 'rgba(26, 15, 8, 0.5)',
                      borderColor: 'rgba(212, 175, 55, 0.2)',
                      color: '#F5F0E6',
                      fontSize: '0.7rem',
                    }}
                    onFocus={e => { (e.target as HTMLElement).style.borderColor = 'rgba(212, 175, 55, 0.5)'; }}
                    onBlur={e => { (e.target as HTMLElement).style.borderColor = 'rgba(212, 175, 55, 0.2)'; }}
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-300"
                    style={{ color: 'rgba(212, 175, 55, 0.6)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#D4AF37'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(212, 175, 55, 0.6)'; }}
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Divider */}
      <div className="container mx-auto px-8 lg:px-16">
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.25), transparent)' }} />
      </div>

      {/* Bottom Bar */}
      <div className="container mx-auto px-8 lg:px-16 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p
            className="text-xs"
            style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(245, 240, 230, 0.3)', letterSpacing: '0.06em' }}
          >
            © {new Date().getFullYear()} RoyalStay Luxury Residences. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(245, 240, 230, 0.25)', letterSpacing: '0.06em' }}>
              Crafted with distinction by
            </span>
            <span
              className="text-xs"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #D4AF37, #F7E7CE)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Corenova Agency
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;



// const Footer = () => {
//   return (
//     <footer className="bg-luxury-950 border-t border-luxury-800">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* Brand */}
//           <div className="col-span-1 md:col-span-2">
//             <div className="flex items-center mb-6">
//               <img 
//                 src="/images/logos/siri6.3.png" 
//                 alt="RoyalStay" 
//                 className="h-20 w-auto object-contain"
//               />
//             </div>
//             <p className="text-gray-400 mb-6 max-w-md">
//               Where luxury meets tranquility. Experience the finest accommodations 
//               and create memories that last a lifetime.
//             </p>
//             <div className="flex space-x-4">
//               <a href="#" className="text-gray-400 hover:text-royal-400 transition-colors">
//                 <span className="sr-only">Facebook</span>
//                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//                 </svg>
//               </a>
//               <a href="#" className="text-gray-400 hover:text-royal-400 transition-colors">
//                 <span className="sr-only">Instagram</span>
//                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-.76 0-1.376-.616-1.376-1.376s.616-1.376 1.376-1.376 1.376.616 1.376 1.376-.616 1.376-1.376 1.376zm7.099 0c-.76 0-1.376-.616-1.376-1.376s.616-1.376 1.376-1.376 1.376.616 1.376 1.376-.616 1.376-1.376 1.376z"/>
//                 </svg>
//               </a>
//               <a href="#" className="text-gray-400 hover:text-royal-400 transition-colors">
//                 <span className="sr-only">Twitter</span>
//                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
//                 </svg>
//               </a>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h4 className="text-white font-semibold mb-4">Quick Links</h4>
//             <ul className="space-y-2">
//               <li><a href="#home" className="text-gray-400 hover:text-royal-400 transition-colors">Home</a></li>
//               <li><a href="#stays" className="text-gray-400 hover:text-royal-400 transition-colors">Explore Stays</a></li>
//               <li><a href="#about" className="text-gray-400 hover:text-royal-400 transition-colors">About Us</a></li>
//               <li><a href="#contact" className="text-gray-400 hover:text-royal-400 transition-colors">Contact</a></li>
//             </ul>
//           </div>

//           {/* Support */}
//           <div>
//             <h4 className="text-white font-semibold mb-4">Support</h4>
//             <ul className="space-y-2">
//               <li><a href="#" className="text-gray-400 hover:text-royal-400 transition-colors">Help Center</a></li>
//               <li><a href="#" className="text-gray-400 hover:text-royal-400 transition-colors">Privacy Policy</a></li>
//               <li><a href="#" className="text-gray-400 hover:text-royal-400 transition-colors">Terms of Service</a></li>
//               <li><a href="#" className="text-gray-400 hover:text-royal-400 transition-colors">Cancellation Policy</a></li>
//             </ul>
//           </div>
//         </div>

//         {/* Corenova Agency Section - Enhanced and Stylish */}
//         <div className="flex justify-center my-16">
//           <div className="text-center max-w-2xl">
//             <div className="mb-8">
//               <p className="text-gray-400 text-lg mb-2">
//                 ✨ Proudly Owned & Operated by
//               </p>
//               <div className="h-2 w-32 bg-gradient-to-r from-royal-400 to-luxury-400 rounded-full mx-auto mb-6"></div>
//             </div>
            
//             <a 
//               href="https://www.corenova.agency" 
//               target="_blank" 
//               rel="noopener noreferrer"
//               className="group block"
//             >
//               <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 shadow-2xl border border-gray-800 hover:border-royal-400 transition-all duration-300 hover:shadow-royal-400/20 hover:shadow-2xl transform hover:-translate-y-1">
//                 {/* Decorative elements */}
//                 <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-royal-400/5 to-luxury-400/5 rounded-2xl"></div>
//                 <div className="absolute -top-2 -right-2 w-4 h-4 bg-royal-400 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
//                 <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-luxury-400 rounded-full opacity-50 group-hover:opacity-80 transition-opacity"></div>
                
//                 <div className="relative z-10">
//                   <div className="h-32 w-full mb-6 flex items-center justify-center">
//                     <img 
//                       src="/images/logos/corenovalogo.png" 
//                       alt="Corenova Agency" 
//                       className="h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
//                     />
//                   </div>
                  
//                   <div className="space-y-3">
//                     <h4 className="text-2xl font-bold text-white group-hover:text-royal-400 transition-colors">
//                       Corenova Agency
//                     </h4>
//                     <p className="text-gray-400 text-sm leading-relaxed">
//                       🏢 <span className="font-semibold text-royal-400">Business Excellence</span> • 
//                       <span className="font-semibold text-luxury-400"> Strategic Solutions</span> • 
//                       <span className="font-semibold text-royal-400"> Innovation</span>
//                     </p>
//                     <p className="text-gray-300 text-sm italic">
//                       "Right people. Right time. Real impact."
//                     </p>
                    
//                     <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-400 group-hover:text-royal-400 transition-colors">
//                       <span>Visit Our Website</span>
//                       <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </a>
            
//             <div className="mt-6 text-center">
//               <p className="text-gray-500 text-sm">
//                 🤝 <span className="text-royal-400 font-medium">RoyalStay</span> is a premium hospitality venture by 
//                 <span className="text-luxury-400 font-medium"> Corenova Agency</span>
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="border-t border-luxury-800 mt-6 pt-8">
//           <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
//             <div className="flex items-center">
//               <img 
//                 src="/images/logos/siri6.3.png" 
//                 alt="RoyalStay" 
//                 className="h-12 w-auto object-contain mr-3"
//               />
//               <p className="text-gray-400 text-sm">
//                 © 2024 RoyalStay. All rights reserved.
//               </p>
//             </div>
//             <div className="flex items-center space-x-4 text-sm text-gray-500">
//               <span>Powered by</span>
//               <a 
//                 href="https://www.corenova.agency" 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="text-royal-400 hover:text-luxury-400 transition-colors font-medium"
//               >
//                 Corenova Agency
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
