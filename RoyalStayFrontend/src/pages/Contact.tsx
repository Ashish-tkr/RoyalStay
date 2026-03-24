
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import e from 'express';
import { useState } from 'react';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    info: 'hello@RoyalStay.com',
    description: 'Send us an email anytime'
  },
  {
    icon: Phone,
    title: 'Call Us',
    info: '+91 98765 43210',
    description: '24/7 customer support'
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    info: 'Mumbai, Maharashtra, India',
    description: 'Our headquarters'
  },
  {
    icon: Clock,
    title: 'Business Hours',
    info: '24/7 Available',
    description: 'Always here for you'
  }
];

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };


  const handleSubmit = async (e: any) => {
    e.preventDefault();


    try {
      const res = await fetch("http://localhost:5000/auth/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Message sent successfully!");
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        alert("❌ Failed to send message");
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Something went wrong");
    }
  };


  return (
    <div className="min-h-screen bg-luxury-950">
      <Navbar />

      {/* Header Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            Get In <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions about your stay? Need assistance with booking? We're here to help you 24/7.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((item, index) => (
              <div
                key={item.title}
                className="luxury-card p-6 rounded-xl text-center hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-royal-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-royal-400 font-medium mb-1">{item.info}</p>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-8">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-royal-400"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      id="lastName"
                      className="w-full px-4 py-3 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-royal-400"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-royal-400"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-royal-400"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={handleChange}
                    id="subject"
                    className="w-full px-4 py-3 bg-luxury-800 border border-luxury-700 rounded-lg text-white focus:outline-none focus:border-royal-400"
                  >
                    <option value="">Select a subject</option>
                    <option value="booking">Booking Inquiry</option>
                    <option value="support">Customer Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-luxury-800 border border-luxury-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-royal-400 resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <Button
                  onClick={(e) => handleSubmit(e)}
                  type="submit"
                  size="lg"
                  className="w-full bg-royal-gradient hover:shadow-lg hover:shadow-royal-500/25 transition-all duration-300"
                >
                  Send Message
                </Button>
              </form>
            </div>

            {/* Map */}
            <div className="animate-scale-in">
              <h2 className="text-3xl font-bold mb-8">Find Us</h2>
              <div className="luxury-card rounded-2xl overflow-hidden h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.6946990401997!2d72.87765731490205!3d19.076090287102827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1633087851235!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="RoyalStay Location"
                ></iframe>
              </div>

              {/* Contact Details */}
              <div className="mt-8 luxury-card p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-white mb-4">Quick Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-royal-400 mr-3" />
                    <span className="text-gray-300">hello@RoyalStay.com</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-royal-400 mr-3" />
                    <span className="text-gray-300">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-royal-400 mr-3" />
                    <span className="text-gray-300">Mumbai, Maharashtra, India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
