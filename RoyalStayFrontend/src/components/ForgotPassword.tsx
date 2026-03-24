import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/auth/forgot-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
        navigate("/reset-password", { state: { email } });
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-luxury-950">
      <Navbar />

      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="luxury-card p-8 rounded-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Forgot <span className="gradient-text">Password</span>
              </h1>
              <p className="text-gray-400">
                Enter your registered email to receive an OTP
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-royal-400"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-royal-gradient hover:shadow-lg hover:shadow-royal-500/25 transition-all duration-300"
                size="lg"
              >
                Send OTP
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
