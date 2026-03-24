import api from '@/lib/axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { handleError } from '@/utils';
import axios from "axios";
import { set } from 'date-fns';

axios.defaults.withCredentials = true;

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    otp: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    subscribeNewsletter: false,
    purpose: 'register' // <-- ensure purpose is present
  });

  interface ApiResponse {
    success: boolean;
    message: string;
    [key: string]: any; // allow extra keys if backend returns more
  }

  const navigate = useNavigate();

  // === OTP HANDLERS ===
  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      const res = await api.post<ApiResponse>("/auth/send-otp", {
        email: formData.email,
        purpose: formData.purpose
      });

      if (res.data.success) {
        alert("OTP sent successfully");
      } else {
        alert(res.data.message || "Failed to send OTP");
      }
    } catch (error) {
      handleError(error);
    }
    setIsLoading(false);
  };


  //Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      alert('Please agree to the terms and conditions');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Call verify-otp API before signup
    try {
      const verifyRes = await api.post<ApiResponse>("/auth/verify-otp", {
        email: formData.email,
        otp: formData.otp
      });

      if (!verifyRes.data.success) {
        alert(verifyRes.data.message || "OTP verification failed");
        return;
      }
    } catch (error) {
      handleError(error);
      return;
    }

    // If OTP verified, proceed to signup
    try {
      setLoading(true);
      const url = 'http://localhost:5000/auth/signup';
      // Exclude otp and purpose from the payload
      const { otp, purpose, ...signupData } = formData;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
      });
      const result = await response.json();
      const { success, message } = result;
      if (success) {
        navigate('/signin');
      } else {
        alert(message || "Signup failed");
      }

      console.log(result);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    console.log('Input changed:', { name, value });
    const copyLoginInfo = { ...formData };
    copyLoginInfo[name] = /*type === 'checkbox' ? checked :*/ value;
    setFormData(copyLoginInfo);
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

  };
  console.log('Form data -> ', formData);

  return (
    <div className="min-h-screen bg-luxury-950">
      <Navbar />

      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="luxury-card p-8 rounded-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Join <span className="gradient-text">RoyalStay</span>
              </h1>
              <p className="text-gray-400">
                Create your account for exclusive luxury experiences
              </p>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-royal-400"
                      placeholder="First name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-royal-400"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-royal-400"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-royal-400"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-royal-400"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-royal-400"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-royal-600 bg-luxury-800 border-luxury-700 rounded focus:ring-royal-500 focus:ring-2 mt-1"
                    required
                  />
                  <label htmlFor="termsAccepted" className="ml-2 text-sm text-gray-300">
                    I agree to the{' '}
                    <Link to="/terms" className="text-royal-400 hover:text-royal-300">
                      Terms and Conditions
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-royal-400 hover:text-royal-300">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="subscribeNewsletter"
                    name="subscribeNewsletter"
                    checked={formData.subscribeNewsletter}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-royal-600 bg-luxury-800 border-luxury-700 rounded focus:ring-royal-500 focus:ring-2"
                  />
                  <label htmlFor="subscribeNewsletter" className="ml-2 text-sm text-gray-300">
                    Subscribe to our newsletter for exclusive offers
                  </label>
                </div>
              </div>


              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">
                  OTP Verification
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={formData.otp || ""}
                    onChange={handleInputChange}
                    className="flex-1 pl-4 pr-4 py-3 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-royal-400"
                    placeholder="Enter OTP"
                  />


                  <Button type="button" onClick={handleSendOtp} className="bg-royal-gradient">

                    {isLoading ? <div className="w-5 h-5 border-2 border-transparent border-t-white rounded-full animate-spin"></div> : "Send OTP"}
                  </Button>

                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-royal-gradient hover:shadow-lg hover:shadow-royal-500/25 transition-all duration-300"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-luxury-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-luxury-800 text-gray-400">Or continue with</span>
              </div>
            </div>

            {/* Social Sign Up */}
            <div className="">
              <Button
                variant="outline"
                className="border-luxury-700  w-full flex items-center justify-center text-gray-300 hover:bg-luxury-700"
                onClick={() => window.location.href = "http://localhost:5000/auth/google"}
              >
                <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>

            </div>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/signin"
                  className="text-royal-400 hover:text-royal-300 font-medium transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div  >
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SignUp;
