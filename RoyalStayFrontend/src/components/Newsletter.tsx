import { useState } from 'react';
import { Mail, Send, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple email validation
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Reset error if any
    setError('');
    
    // In a real app, this would send the email to a backend
    // For now, just simulate success
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-64 h-64 bg-royal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-5xl mx-auto relative">
        <div className="luxury-card p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-luxury-900 to-luxury-800 border border-luxury-700">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-royal-gradient mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Stay <span className="gradient-text">Updated</span>
              </h2>
              
              <p className="text-gray-300 mb-6">
                Subscribe to our newsletter for exclusive offers, travel inspiration, and luxury stay recommendations tailored just for you.
              </p>
              
              <div className="hidden md:block">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-royal-400" />
                  <span>Exclusive deals and offers</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-royal-400" />
                  <span>Travel guides and destination tips</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-royal-400" />
                  <span>Early access to new properties</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 pl-12 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-royal-400"
                    disabled={isSubmitted}
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
                
                <Button
                  type="submit"
                  className="w-full bg-royal-gradient hover:shadow-lg hover:shadow-royal-500/25 py-6 h-auto"
                  disabled={isSubmitted}
                >
                  {isSubmitted ? (
                    <span className="flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      Subscribed!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Subscribe Now
                    </span>
                  )}
                </Button>
                
                <p className="text-center text-xs text-gray-400">
                  By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                </p>
              </form>
              
              <div className="mt-6 md:hidden">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-royal-400" />
                  <span>Exclusive deals and offers</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-royal-400" />
                  <span>Travel guides and destination tips</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-royal-400" />
                  <span>Early access to new properties</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter; 