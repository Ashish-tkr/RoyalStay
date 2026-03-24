const Footer = () => {
  return (
    <footer className="bg-luxury-950 border-t border-luxury-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <img 
                src="/images/logos/siri6.3.png" 
                alt="Sirinilaya" 
                className="h-20 w-auto object-contain"
              />
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Where luxury meets tranquility. Experience the finest accommodations 
              and create memories that last a lifetime.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-royal-400 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-royal-400 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-.76 0-1.376-.616-1.376-1.376s.616-1.376 1.376-1.376 1.376.616 1.376 1.376-.616 1.376-1.376 1.376zm7.099 0c-.76 0-1.376-.616-1.376-1.376s.616-1.376 1.376-1.376 1.376.616 1.376 1.376-.616 1.376-1.376 1.376z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-royal-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-royal-400 transition-colors">Home</a></li>
              <li><a href="#stays" className="text-gray-400 hover:text-royal-400 transition-colors">Explore Stays</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-royal-400 transition-colors">About Us</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-royal-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-royal-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-royal-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-royal-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-royal-400 transition-colors">Cancellation Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Corenova Agency Section - Enhanced and Stylish */}
        <div className="flex justify-center my-16">
          <div className="text-center max-w-2xl">
            <div className="mb-8">
              <p className="text-gray-400 text-lg mb-2">
                ✨ Proudly Owned & Operated by
              </p>
              <div className="h-2 w-32 bg-gradient-to-r from-royal-400 to-luxury-400 rounded-full mx-auto mb-6"></div>
            </div>
            
            <a 
              href="https://www.corenova.agency" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 shadow-2xl border border-gray-800 hover:border-royal-400 transition-all duration-300 hover:shadow-royal-400/20 hover:shadow-2xl transform hover:-translate-y-1">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-royal-400/5 to-luxury-400/5 rounded-2xl"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-royal-400 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-luxury-400 rounded-full opacity-50 group-hover:opacity-80 transition-opacity"></div>
                
                <div className="relative z-10">
                  <div className="h-32 w-full mb-6 flex items-center justify-center">
                    <img 
                      src="/images/logos/corenovalogo.png" 
                      alt="Corenova Agency" 
                      className="h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-2xl font-bold text-white group-hover:text-royal-400 transition-colors">
                      Corenova Agency
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      🏢 <span className="font-semibold text-royal-400">Business Excellence</span> • 
                      <span className="font-semibold text-luxury-400"> Strategic Solutions</span> • 
                      <span className="font-semibold text-royal-400"> Innovation</span>
                    </p>
                    <p className="text-gray-300 text-sm italic">
                      "Right people. Right time. Real impact."
                    </p>
                    
                    <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-400 group-hover:text-royal-400 transition-colors">
                      <span>Visit Our Website</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </a>
            
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                🤝 <span className="text-royal-400 font-medium">Sirinilaya</span> is a premium hospitality venture by 
                <span className="text-luxury-400 font-medium"> Corenova Agency</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-luxury-800 mt-6 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center">
              <img 
                src="/images/logos/siri6.3.png" 
                alt="Sirinilaya" 
                className="h-12 w-auto object-contain mr-3"
              />
              <p className="text-gray-400 text-sm">
                © 2024 Sirinilaya. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Powered by</span>
              <a 
                href="https://www.corenova.agency" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-royal-400 hover:text-luxury-400 transition-colors font-medium"
              >
                Corenova Agency
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
