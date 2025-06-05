import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search } from 'lucide-react';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollPosition = window.scrollY;
      heroRef.current.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      <div 
        ref={heroRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
          willChange: 'transform'
        }}
      />
      
      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6 animate-fadeIn">
              <Calendar className="h-12 w-12 text-blue-400" />
              <h1 className="ml-4 text-5xl font-bold text-white">EventHub</h1>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 animate-slideUp">
              Discover & Join Amazing Events
            </h2>
            
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto animate-slideUp animation-delay-200">
              Find the perfect events for networking, learning, and growing your skills.
              Or create and manage your own events with our powerful platform.
            </p>
            
            <div className="max-w-2xl mx-auto mb-8 animate-slideUp animation-delay-400">
              <div className="flex flex-col sm:flex-row shadow-lg rounded-lg overflow-hidden">
                <div className="flex-grow">
                  <input 
                    type="text" 
                    placeholder="Search for events..." 
                    className="w-full px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border-0"
                  />
                </div>
                <button 
                  className="bg-blue-600 text-white px-8 py-4 hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-slideUp animation-delay-600">
              <button 
                onClick={() => navigate('/events')}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 text-lg font-medium w-full sm:w-auto"
              >
                Browse Events
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition duration-300 text-lg font-medium w-full sm:w-auto"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-white flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white rounded-full animate-scroll"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
