import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, Users, Share2, Heart, AlertCircle, IndianRupee } from 'lucide-react';
import { supabase } from '../lib/supabase';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { events, applications, registerForEvent } = useEvents();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<Array<{ name: string }>>([]);

  const event = events.find(e => e.id === id);

  useEffect(() => {
    if (event) {
      fetchRegisteredUsers();
    }
  }, [event]);

  const fetchRegisteredUsers = async () => {
    if (!event) return;

    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('profiles:user_id(name)')
        .eq('event_id', event.id);

      if (error) throw error;

      setRegisteredUsers(data.map(registration => registration.profiles));
    } catch (error) {
      console.error('Error fetching registered users:', error);
    }
  };
  
  if (!event) {
    return (
      <div className="pt-16 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/events" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150">
            Browse All Events
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isRegistered = isAuthenticated && applications.some(
    app => app.eventId === event.id && app.userId === user?.id
  );

  const canRegister = event.status !== 'past' && event.registeredCount < event.capacity;

  const handleRegister = async () => {
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return;
    }

    try {
      setRegistrationError(null);
      
      const { error } = await supabase
        .from('registrations')
        .insert([
          { event_id: event.id, user_id: user!.id }
        ]);

      if (error) throw error;

      // Refresh registered users list
      await fetchRegisteredUsers();
      setShowSuccessModal(true);
    } catch (error) {
      setRegistrationError(error instanceof Error ? error.message : 'Failed to register for event');
    }
  };

  const getStatusBadge = () => {
    switch (event.status) {
      case 'upcoming':
        return <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">Upcoming</span>;
      case 'present':
        return <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">Happening Now</span>;
      case 'past':
        return <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-sm font-semibold rounded-full">Past Event</span>;
      default:
        return null;
    }
  };

  const RegisteredUsersList = () => (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Registered Attendees</h3>
      {registeredUsers.length > 0 ? (
        <ul className="space-y-2">
          {registeredUsers.map((user, index) => (
            <li key={index} className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              {user.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No attendees registered yet</p>
      )}
    </div>
  );

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-green-600 mb-4">Registration Successful!</h3>
            <p className="text-gray-600 mb-6">
              You have successfully registered for {event.title}. We look forward to seeing you at the event!
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-150"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <div 
        className="relative h-80 md:h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${event.image})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-4">
            <div className="mb-4">
              {getStatusBadge()}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{event.title}</h1>
            <p className="text-lg md:text-xl text-gray-200 mb-6">{event.location}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="flex items-center px-4 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition duration-150">
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </button>
              <button className="flex items-center px-4 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition duration-150">
                <Heart className="h-5 w-5 mr-2" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-700 mb-6 whitespace-pre-line">
                {event.description}
              </p>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-6 w-6 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Date</h4>
                      <p className="text-gray-600">{formatDate(event.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-6 w-6 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Time</h4>
                      <p className="text-gray-600">{formatTime(event.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Location</h4>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="h-6 w-6 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Capacity</h4>
                      <p className="text-gray-600">
                        {event.registeredCount} / {event.capacity} registered
                        {event.registeredCount >= event.capacity && (
                          <span className="ml-2 text-red-600 font-medium">Sold Out</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <IndianRupee className="h-6 w-6 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Registration Fee</h4>
                      <p className="text-gray-600">₹0</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Organizer</h2>
              <div className="flex items-center">
                <div className="bg-blue-100 h-12 w-12 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">O</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Tech Events Inc</h3>
                  <p className="text-gray-600">Professional Event Organizer</p>
                </div>
              </div>
              <button className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-150">
                View Organizer Profile
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Registration</h3>
                <p className="text-gray-700">
                  {canRegister 
                    ? `${event.capacity - event.registeredCount} spots left` 
                    : event.status === 'past' 
                      ? 'This event has ended' 
                      : 'This event is sold out'
                  }
                </p>
              </div>
              
              {showLoginAlert && (
                <div className="mb-6 p-4 bg-yellow-50 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-700 font-medium">Login Required</p>
                    <p className="text-yellow-600 text-sm mt-1">Please log in to register for this event.</p>
                    <div className="mt-3 flex space-x-3">
                      <button 
                        onClick={() => navigate('/login')}
                        className="text-sm text-blue-600 hover:text-blue-800 transition duration-150"
                      >
                        Log in
                      </button>
                      <button 
                        onClick={() => navigate('/register')}
                        className="text-sm text-blue-600 hover:text-blue-800 transition duration-150"
                      >
                        Sign up
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {registrationError && (
                <div className="mb-6 p-4 bg-red-50 rounded-md">
                  <p className="text-red-700">{registrationError}</p>
                </div>
              )}
              
              <button 
                onClick={handleRegister}
                disabled={!canRegister || isRegistered}
                className={`w-full py-3 px-4 rounded-md text-white text-lg font-medium transition duration-150 ${
                  !canRegister 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : isRegistered
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isRegistered 
                  ? 'Registered' 
                  : event.status === 'past'
                    ? 'Event Ended'
                    : event.registeredCount >= event.capacity
                      ? 'Sold Out'
                      : 'Register Now'
                }
              </button>
              
              {isRegistered && (
                <p className="text-sm text-gray-600 mt-2 text-center">
                  You're registered for this event
                </p>
              )}

              <RegisteredUsersList />
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Share this event</h3>
                <div className="flex space-x-3">
                  <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-2 rounded-full transition duration-150">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-2 rounded-full transition duration-150">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 14-7.496 14-13.986 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </button>
                  <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-2 rounded-full transition duration-150">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </button>
                  <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-2 rounded-full transition duration-150">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;