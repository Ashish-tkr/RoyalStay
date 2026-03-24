import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings, BookOpen, Crown, Menu, X } from 'lucide-react';
import axios from 'axios';

interface UserData {
  _id: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  picture?: string;
}

interface ApiResponse {
  success: boolean;
  user: UserData | null;
  message?: string;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore-stays', label: 'Explore Stays' },
    { href: '/facilities', label: 'Facilities' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get<ApiResponse>('http://localhost:5000/home', {
          withCredentials: true,
        });
        if (response.data.user) {
          setUserData(response.data.user);
          setIsLogin(true);
        } else {
          setUserData(null);
          setIsLogin(false);
        }
      } catch {
        setUserData(null);
        setIsLogin(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
      setUserData(null);
      setIsLogin(false);
      navigate('/');
    } catch {
      setUserData(null);
      setIsLogin(false);
      navigate('/');
    }
  };

  const getUserInitials = (user: UserData) => {
    if (user.name?.length > 0) return user.name[0].toUpperCase();
    return user.email[0].toUpperCase();
  };

  const getUserDisplayName = (user: UserData) => {
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    return user.name || user.email;
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <nav
        className="fixed top-0 w-full z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? 'rgba(10, 8, 5, 0.96)'
            : 'linear-gradient(180deg, rgba(10,8,5,0.7) 0%, transparent 100%)',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(8px)',
          borderBottom: scrolled ? '1px solid rgba(212, 175, 55, 0.12)' : 'none',
          boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-sm flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #B8940F 100%)',
                    boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
                  }}
                >
                  <Crown size={18} className="text-black" />
                </div>
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
                  className="text-xs tracking-widest"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: 'italic',
                    color: 'rgba(212, 175, 55, 0.55)',
                    marginTop: '-2px',
                    letterSpacing: '0.25em',
                  }}
                >
                  Luxury Residences
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative text-xs tracking-widest uppercase transition-all duration-300"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    color: isActive(link.href) ? '#D4AF37' : 'rgba(245, 240, 230, 0.65)',
                    letterSpacing: '0.18em',
                  }}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-1 left-0 h-px transition-all duration-300"
                    style={{
                      width: isActive(link.href) ? '100%' : '0%',
                      background: 'linear-gradient(90deg, #D4AF37, transparent)',
                    }}
                  />
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            <div className="hidden lg:flex items-center gap-4">
              {loading ? (
                <div className="w-8 h-8 rounded-full animate-pulse" style={{ background: 'rgba(212, 175, 55, 0.2)' }} />
              ) : isLogin && userData ? (
                <div className="flex items-center gap-4">
                  <span
                    className="text-xs tracking-wider"
                    style={{ color: 'rgba(212, 175, 55, 0.7)', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
                  >
                    Welcome, {getUserDisplayName(userData).split(' ')[0]}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="relative group">
                        <Avatar className="h-9 w-9 ring-1 ring-offset-1 ring-offset-black transition-all duration-300 group-hover:ring-2"
                          style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
                          <AvatarImage src={userData.avatar || userData.picture} alt={getUserDisplayName(userData)} />
                          <AvatarFallback style={{ background: 'linear-gradient(135deg, #D4AF37, #8B6914)', color: '#0A0805', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                            {getUserInitials(userData)}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52 border"
                      style={{ background: 'rgba(15, 12, 10, 0.98)', backdropFilter: 'blur(20px)', borderColor: 'rgba(212, 175, 55, 0.15)' }}>
                      <div className="px-3 py-3 border-b" style={{ borderColor: 'rgba(212, 175, 55, 0.12)' }}>
                        <p className="text-sm font-medium" style={{ color: '#F5F0E6' }}>{getUserDisplayName(userData)}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(212, 175, 55, 0.6)' }}>{userData.email}</p>
                      </div>
                      <DropdownMenuItem onClick={() => navigate('/my-bookings')}
                        className="cursor-pointer gap-2 text-xs tracking-wider uppercase my-1 transition-colors"
                        style={{ color: 'rgba(245, 240, 230, 0.75)', fontFamily: "'DM Sans', sans-serif" }}>
                        <BookOpen size={14} className="text-amber-500" /> My Bookings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/profile')}
                        className="cursor-pointer gap-2 text-xs tracking-wider uppercase mb-1 transition-colors"
                        style={{ color: 'rgba(245, 240, 230, 0.75)', fontFamily: "'DM Sans', sans-serif" }}>
                        <Settings size={14} className="text-amber-500" /> Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator style={{ background: 'rgba(212, 175, 55, 0.1)' }} />
                      <DropdownMenuItem onClick={handleLogout}
                        className="cursor-pointer gap-2 text-xs tracking-wider uppercase mt-1 transition-colors"
                        style={{ color: 'rgba(239, 68, 68, 0.8)', fontFamily: "'DM Sans', sans-serif" }}>
                        <LogOut size={14} /> Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/signin">
                    <button
                      className="text-xs tracking-widest uppercase px-5 py-2.5 transition-all duration-300 border rounded"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 500,
                        color: 'rgba(212, 175, 55, 0.8)',
                        borderColor: 'rgba(212, 175, 55, 0.25)',
                        letterSpacing: '0.18em',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(212, 175, 55, 0.06)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212, 175, 55, 0.5)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212, 175, 55, 0.25)';
                      }}
                    >
                      Sign In
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button
                      className="text-xs tracking-widest uppercase px-5 py-2.5 transition-all duration-300 rounded"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #D4AF37 0%, #B8940F 100%)',
                        color: '#0A0805',
                        letterSpacing: '0.18em',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(212, 175, 55, 0.35)';
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      }}
                    >
                      Join Now
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 transition-colors"
              style={{ color: isMenuOpen ? '#D4AF37' : 'rgba(245, 240, 230, 0.7)' }}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="lg:hidden border-t"
            style={{
              background: 'rgba(10, 8, 5, 0.98)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(212, 175, 55, 0.1)',
            }}
          >
            <div className="container mx-auto px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-xs tracking-widest uppercase py-2 border-b transition-colors"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: isActive(link.href) ? '#D4AF37' : 'rgba(245, 240, 230, 0.6)',
                    borderColor: 'rgba(212, 175, 55, 0.08)',
                    letterSpacing: '0.2em',
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                {!loading && isLogin && userData ? (
                  <>
                    <button onClick={() => { navigate('/my-bookings'); setIsMenuOpen(false); }}
                      className="flex items-center gap-2 text-xs tracking-wider uppercase py-2 transition-colors"
                      style={{ color: 'rgba(245, 240, 230, 0.7)', fontFamily: "'DM Sans', sans-serif" }}>
                      <BookOpen size={14} className="text-amber-500" /> My Bookings
                    </button>
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="text-xs tracking-wider uppercase py-2.5 rounded text-left transition-colors"
                      style={{ color: 'rgba(239, 68, 68, 0.8)', fontFamily: "'DM Sans', sans-serif" }}>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full text-xs tracking-widest uppercase py-3 border rounded transition-all"
                        style={{ color: '#D4AF37', borderColor: 'rgba(212, 175, 55, 0.3)', fontFamily: "'DM Sans', sans-serif" }}>
                        Sign In
                      </button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full text-xs tracking-widest uppercase py-3 rounded transition-all"
                        style={{ background: 'linear-gradient(135deg, #D4AF37, #B8940F)', color: '#0A0805', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                        Join Now
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Dialog */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent style={{ background: 'rgba(15, 12, 10, 0.98)', border: '1px solid rgba(212, 175, 55, 0.15)', color: '#F5F0E6' }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }}>
              Authentication Required
            </DialogTitle>
            <DialogDescription style={{ color: 'rgba(245, 240, 230, 0.6)' }}>
              Please sign in to continue with your booking.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Link to="/signin" onClick={() => setAuthDialogOpen(false)}>
              <button className="w-full text-xs tracking-widest uppercase py-3 rounded transition-all"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #B8940F)', color: '#0A0805', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                Sign In
              </button>
            </Link>
            <Link to="/signup" onClick={() => setAuthDialogOpen(false)}>
              <button className="w-full text-xs tracking-widest uppercase py-3 border rounded transition-all"
                style={{ color: '#D4AF37', borderColor: 'rgba(212, 175, 55, 0.3)', fontFamily: "'DM Sans', sans-serif" }}>
                Create Account
              </button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;


// import { useEffect, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle, 
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger, 
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { User, LogOut, Settings, BookOpen } from 'lucide-react';
// import axios from 'axios';

// // Define the user data type
// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   firstName?: string;
//   lastName?: string;
//   phone?: string;
//   avatar?: string;
//   picture?: string;
// }

// // Define the API response type
// interface ApiResponse {
//   success: boolean;
//   user: User | null;
//   message?: string;
// }

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [userData, setUserData] = useState<User | null>(null);
//   const [authDialogOpen, setAuthDialogOpen] = useState(false);
//   const [isLogin, setIsLogin] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const navLinks = [
//     { href: '/', label: 'Home' },
//     { href: '/explore-stays', label: 'Explore Stays' },
//     { href: '/facilities', label: 'Facilities' },
//     { href: '/gallery', label: 'Gallery' },
//     { href: '/about', label: 'About' },
//     { href: '/contact', label: 'Contact' }
//   ];

//   // Check authentication status on component mount
//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         console.log('Checking authentication status...');
        
//         const response = await axios.get<ApiResponse>('http://localhost:5000/home', {
//           withCredentials: true,
//           headers: {
//             'Content-Type': 'application/json',
//           }
//         });

//         console.log('Auth check response:', response.data);

//         if (response.data.user) {
//           setUserData(response.data.user);
//           setIsLogin(true);
//           console.log('User is authenticated:', response.data.user);
//         } else {
//           setUserData(null);
//           setIsLogin(false);
//           console.log('User is not authenticated');
//         }
//       } catch (error) {
//         console.log('Authentication check failed:', error);
//         setUserData(null);
//         setIsLogin(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuthStatus();
//   }, []);

//   const handleBookNow = () => {
//     if (isLogin && userData) {
//       navigate('/booking');
//     } else {
//       setAuthDialogOpen(true);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       console.log('Logging out...');
      
//       await axios.post('http://localhost:5000/auth/logout', {}, {
//         withCredentials: true,
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });

//       setUserData(null);
//       setIsLogin(false);
//       console.log('Logout successful');
      
//       navigate('/');
//     } catch (error) {
//       console.error('Logout failed:', error);
//       setUserData(null);
//       setIsLogin(false);
//       navigate('/');
//     }
//   };

//   const getUserInitials = (user: User) => {
//     if (user.name && user.name.length > 0) {
//       return user.name[0].toUpperCase();
//     }
//     return user.email[0].toUpperCase();
//   };

//   const getUserDisplayName = (user: User) => {
//     if (user.firstName && user.lastName) {
//       return `${user.firstName} ${user.lastName}`;
//     }
//     return user.name || user.email;
//   };

//   // User Profile Dropdown Component
//   const UserProfileDropdown = () => (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild onClick={(e) => {
//           e.preventDefault();
//           setIsMenuOpen(!isMenuOpen);
//         }}>
//         <Button variant="ghost" className="relative h-10 w-10 rounded-full">
//           <Avatar className="h-10 w-10">
//            {userData?.avatar || userData?.picture ? (
//            <AvatarImage src={userData.avatar || userData.picture} />
//            ) : (
//                  <AvatarFallback className="bg-royal-gradient text-white text-2xl">
//                   {getUserInitials(userData!)}
//                  </AvatarFallback>
//                 )}
//           </Avatar>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-56" align="end" forceMount>
//         <div className="flex flex-col space-y-1 p-2">
//           <p className="text-sm font-medium leading-none">{getUserDisplayName(userData!)}</p>
//           <p className="text-xs leading-none text-muted-foreground">
//             {userData!.email}
//           </p>
//         </div>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={() => navigate('/my-bookings')}>
//           <User className="mr-2 h-4 w-4" />
//           <span>My Bookings</span>
//         </DropdownMenuItem>
        
//         <DropdownMenuItem onClick={() => navigate('/profile')}>
//           <Settings className="mr-2 h-4 w-4" />
//           <span>Profile</span>
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={handleLogout}>
//           <LogOut className="mr-2 h-4 w-4" />
//           <span>Log out</span>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );

//   return (
//     <>
//       <nav className="fixed top-0 w-full z-50 glass-morphism">
//         <div className="container mx-auto px-4 lg:px-8">
//           <div className="flex items-center justify-between h-24">
//             {/* Logo - Always visible, no conditional rendering */}
//             <div className="flex-shrink-0 h-full">
//               <Link to="/" className="flex items-center h-full">
//                 <img 
//                   src="/images/logos/siri6.3.png" 
//                   alt="RoyalStay" 
//                   className="h-full w-auto object-contain"
//                 />
//               </Link>
//             </div>

//             {/* Desktop Navigation */}
//             <div className="hidden lg:block">
//               <div className="ml-10 flex items-baseline space-x-6">
//                 {navLinks.map((link) => (
//                   <Link
//                     key={link.href}
//                     to={link.href}
//                     className="text-gray-300 hover:text-royal-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
//                   >
//                     {link.label}
//                   </Link>
//                 ))}
//               </div>
//             </div>

//             {/* Auth & CTA Buttons */}
//             <div className="hidden lg:flex items-center space-x-4">
//               {loading ? (
//                 // Show loading spinner only for the user section
//                 <div className="flex items-center space-x-4">
//                   <div className="animate-pulse bg-gray-600 rounded-full h-10 w-16"></div>
//                 </div>
//               ) : isLogin && userData ? (
//                 <div className="flex items-center space-x-4">
//                   <span className="text-gray-300 text-sm">
//                     Welcome, {getUserDisplayName(userData).split(' ')[0]}
//                   </span>
//                   <UserProfileDropdown />
//                 </div>
//               ) : (
//                 <>
//                   <Link to="/signin">
//                     <Button variant="ghost" className="text-gray-300 hover:text-royal-400">
//                       Sign In
//                     </Button>
//                   </Link>
//                   <Link to="/signup">
//                     <Button className="bg-royal-gradient hover:shadow-lg hover:shadow-royal-500/25 transition-all duration-300">
//                       Sign Up
//                     </Button>
//                   </Link>
//                 </>
//               )}
//             </div>

//             {/* Mobile menu button */}
//             <div className="lg:hidden">
//               <button
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className="text-gray-300 hover:text-royal-400 p-2"
//               >
//                 <span className="sr-only">Open main menu</span>
//                 <div className="w-6 h-6 flex flex-col justify-center space-y-1">
//                   <span className={`block h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
//                   <span className={`block h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
//                   <span className={`block h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Mobile Navigation */}
//           {isMenuOpen && (
//             <div className="lg:hidden">
//               <div className="px-2 pt-2 pb-3 space-y-1 glass-morphism mt-2 rounded-lg">
//                 {navLinks.map((link) => (
//                   <Link
//                     key={link.href}
//                     to={link.href}
//                     className="text-gray-300 hover:text-royal-400 block px-3 py-2 text-base font-medium"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     {link.label}
//                   </Link>
//                 ))}
//                 <div className="pt-4 space-y-2">
//                   {loading ? (
//                     <div className="animate-pulse bg-gray-600 rounded h-10 w-full"></div>
//                   ) : isLogin && userData ? (
//                     <>
//                       <div className="flex items-center space-x-3 px-3 py-2">
//                         <Avatar className="h-8 w-8">
//                           <AvatarImage src={userData.avatar} alt={getUserDisplayName(userData)} />
//                           <AvatarFallback className="bg-royal-gradient text-white text-sm">
//                             {getUserInitials(userData)}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="text-gray-300 text-sm">
//                           Welcome, {getUserDisplayName(userData)}
//                         </div>
//                       </div>
//                       <Button 
//                         onClick={() => {
//                           navigate('/my-bookings');
//                           setIsMenuOpen(false);
//                         }}
//                         variant="ghost" 
//                         className="w-full text-left justify-start text-gray-300 hover:text-royal-400"
//                       >
//                         < BookOpen className="mr-2 h-4 w-4"/>
//                         My Booking
//                       </Button>
//                       <Button 
//                         onClick={() => {
//                           navigate('/profile');
//                           setIsMenuOpen(false);
//                         }}
//                         variant="ghost" 
//                         className="w-full text-left justify-start text-gray-300 hover:text-royal-400"
//                       >
//                         <User className="mr-2 h-4 w-4" />
//                         Profile
//                       </Button>
//                       <Button 
//                         onClick={() => {
//                           handleLogout();
//                           setIsMenuOpen(false);
//                         }}
//                         variant="ghost" 
//                         className="w-full text-left justify-start text-gray-300 hover:text-royal-400"
//                       >
//                         <LogOut className="mr-2 h-4 w-4" />
//                         Logout
//                       </Button>
//                       <Button 
//                         onClick={() => {
//                           handleBookNow();
//                           setIsMenuOpen(false);
//                         }}
//                         className="w-full bg-royal-gradient"
//                       >
//                         Book Now
//                       </Button>
//                     </>
//                   ) : (
//                     <>
//                       <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
//                         <Button variant="ghost" className="w-full text-gray-300 hover:text-royal-400">
//                           Sign In
//                         </Button>
//                       </Link>
//                       <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
//                         <Button className="w-full bg-royal-gradient">
//                           Sign Up
//                         </Button>
//                       </Link>
//                       <Button 
//                         onClick={() => {
//                           setAuthDialogOpen(true);
//                           setIsMenuOpen(false);
//                         }}
//                         className="w-full bg-royal-gradient"
//                       >
//                         Book Now
//                       </Button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </nav>

//       {/* Authentication Dialog */}
//       <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Authentication Required</DialogTitle>
//             <DialogDescription>
//               You need to sign in or create an account to book a stay.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="flex flex-col space-y-4 mt-4">
//             <Link to="/signin" onClick={() => setAuthDialogOpen(false)}>
//               <Button className="w-full">Sign In</Button>
//             </Link>
//             <Link to="/signup" onClick={() => setAuthDialogOpen(false)}>
//               <Button variant="outline" className="w-full">
//                 Create Account
//               </Button>
//             </Link>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default Navbar;