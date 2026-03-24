
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../utils';
import { handleSuccess } from '../utils';
import { set } from 'date-fns';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    // Redirect to Google login page
    setLoading(true);
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log('Sign in data:', formData);

    try {
      setLoading(true);
      const url = 'http://localhost:5000/auth/login';
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include', // Include cookies for session management
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      const { success, message } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          // Redirect or perform any action after success
          navigate('/');
        }, 2000);
      }
      console.log(result);

      if (result.success) {
        toast.success(result.message || 'Login successful');
      } else {
        toast.error(result.message || 'Invalid email or password');
      }

    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    console.log('Input changed:', { name, value });
    const copyLoginInfo = { ...formData };
    copyLoginInfo[name] = /*type === 'checkbox' ? checked :*/ value;
    setFormData(copyLoginInfo);
    /*setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));*/
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
                Welcome <span className="gradient-text">Back</span>
              </h1>
              <p className="text-gray-400">
                Sign in to your RoyalStay account
              </p>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="Enter your password"
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      setFormData({ ...formData, rememberMe: e.target.checked })
                    } className="w-4 h-4 text-royal-600 bg-luxury-800 border-luxury-700 rounded focus:ring-royal-500 focus:ring-2"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300">
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-royal-400 hover:text-royal-300 transition-colors duration-200"
                >
                  Forgot password?
                </Link>
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
                    Signing In...
                  </>
                ) : (
                  "Sign In"
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

            {/* Social Sign In */}
            <div className="">
              <Button
                variant="outline"
                className="border-luxury-700 w-full flex items-center justify-center text-gray-300 hover:bg-luxury-700"
                onClick={handleGoogleLogin}
              >
                <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-royal-400 hover:text-royal-300 font-medium transition-colors duration-200"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SignIn;
