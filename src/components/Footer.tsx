import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Calendar className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">EventHub</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your premier platform for discovering and managing events that matter to you.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition duration-150">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-150">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-150">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-150">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition duration-150">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition duration-150">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white transition duration-150">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition duration-150">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Event Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Event Categories</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-150">
                  Tech Conferences
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-150">
                  Workshops
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-150">
                  Business Summits
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-150">
                  Design Meetups
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-150">
                  Career Fairs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-400">123 Event Street, San Francisco, CA 94103</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-400">contact@eventhub.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-center text-gray-400">
            &copy; {currentYear} EventHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;