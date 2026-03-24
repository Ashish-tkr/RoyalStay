import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle, 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger, 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings, BookOpen } from 'lucide-react';
import axios from 'axios';

// Define the user data type
interface User {
  _id: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  picture?: string;
}

// Define the API response type
interface ApiResponse {
  success: boolean;
  user: User | null;
  message?: string;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore-stays', label: 'Explore Stays' },
    { href: '/facilities', label: 'Facilities' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' }
  ];

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('Checking authentication status...');
        
        const response = await axios.get<ApiResponse>('http://localhost:5000/home', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log('Auth check response:', response.data);

        if (response.data.user) {
          setUserData(response.data.user);
          setIsLogin(true);
          console.log('User is authenticated:', response.data.user);
        } else {
          setUserData(null);
          setIsLogin(false);
          console.log('User is not authenticated');
        }
      } catch (error) {
        console.log('Authentication check failed:', error);
        setUserData(null);
        setIsLogin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleBookNow = () => {
    if (isLogin && userData) {
      navigate('/booking');
    } else {
      setAuthDialogOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      
      await axios.post('http://localhost:5000/auth/logout', {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      setUserData(null);
      setIsLogin(false);
      console.log('Logout successful');
      
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      setUserData(null);
      setIsLogin(false);
      navigate('/');
    }
  };

  const getUserInitials = (user: User) => {
    if (user.name && user.name.length > 0) {
      return user.name[0].toUpperCase();
    }
    return user.email[0].toUpperCase();
  };

  const getUserDisplayName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.name || user.email;
  };

  // User Profile Dropdown Component
  const UserProfileDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => {
          e.preventDefault();
          setIsMenuOpen(!isMenuOpen);
        }}>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
           {userData?.avatar || userData?.picture ? (
           <AvatarImage src={userData.avatar || userData.picture} />
           ) : (
                 <AvatarFallback className="bg-royal-gradient text-white text-2xl">
                  {getUserInitials(userData!)}
                 </AvatarFallback>
                )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">{getUserDisplayName(userData!)}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {userData!.email}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/my-bookings')}>
          <User className="mr-2 h-4 w-4" />
          <span>My Bookings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass-morphism">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo - Always visible, no conditional rendering */}
            <div className="flex-shrink-0 h-full">
              <Link to="/" className="flex items-center h-full">
                <img 
                  src="/images/logos/siri6.3.png" 
                  alt="Sirinilaya" 
                  className="h-full w-auto object-contain"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="ml-10 flex items-baseline space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-gray-300 hover:text-royal-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Auth & CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {loading ? (
                // Show loading spinner only for the user section
                <div className="flex items-center space-x-4">
                  <div className="animate-pulse bg-gray-600 rounded-full h-10 w-16"></div>
                </div>
              ) : isLogin && userData ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300 text-sm">
                    Welcome, {getUserDisplayName(userData).split(' ')[0]}
                  </span>
                  <UserProfileDropdown />
                </div>
              ) : (
                <>
                  <Link to="/signin">
                    <Button variant="ghost" className="text-gray-300 hover:text-royal-400">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-royal-gradient hover:shadow-lg hover:shadow-royal-500/25 transition-all duration-300">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-royal-400 p-2"
              >
                <span className="sr-only">Open main menu</span>
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  <span className={`block h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`block h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 glass-morphism mt-2 rounded-lg">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-gray-300 hover:text-royal-400 block px-3 py-2 text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 space-y-2">
                  {loading ? (
                    <div className="animate-pulse bg-gray-600 rounded h-10 w-full"></div>
                  ) : isLogin && userData ? (
                    <>
                      <div className="flex items-center space-x-3 px-3 py-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={userData.avatar} alt={getUserDisplayName(userData)} />
                          <AvatarFallback className="bg-royal-gradient text-white text-sm">
                            {getUserInitials(userData)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-gray-300 text-sm">
                          Welcome, {getUserDisplayName(userData)}
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          navigate('/my-bookings');
                          setIsMenuOpen(false);
                        }}
                        variant="ghost" 
                        className="w-full text-left justify-start text-gray-300 hover:text-royal-400"
                      >
                        < BookOpen className="mr-2 h-4 w-4"/>
                        My Booking
                      </Button>
                      <Button 
                        onClick={() => {
                          navigate('/profile');
                          setIsMenuOpen(false);
                        }}
                        variant="ghost" 
                        className="w-full text-left justify-start text-gray-300 hover:text-royal-400"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                      <Button 
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        variant="ghost" 
                        className="w-full text-left justify-start text-gray-300 hover:text-royal-400"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                      <Button 
                        onClick={() => {
                          handleBookNow();
                          setIsMenuOpen(false);
                        }}
                        className="w-full bg-royal-gradient"
                      >
                        Book Now
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full text-gray-300 hover:text-royal-400">
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                        <Button className="w-full bg-royal-gradient">
                          Sign Up
                        </Button>
                      </Link>
                      <Button 
                        onClick={() => {
                          setAuthDialogOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full bg-royal-gradient"
                      >
                        Book Now
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Authentication Dialog */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              You need to sign in or create an account to book a stay.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 mt-4">
            <Link to="/signin" onClick={() => setAuthDialogOpen(false)}>
              <Button className="w-full">Sign In</Button>
            </Link>
            <Link to="/signup" onClick={() => setAuthDialogOpen(false)}>
              <Button variant="outline" className="w-full">
                Create Account
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;