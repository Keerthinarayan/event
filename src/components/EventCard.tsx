import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../types';
import { Calendar, MapPin, Users } from 'lucide-react';

interface EventCardProps {
  event: Event;
  compact?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, compact = false }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'past':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'present':
        return 'Happening Now';
      case 'past':
        return 'Past Event';
      default:
        return 'Unknown';
    }
  };

  if (compact) {
    return (
      <Link to={`/events/${event.id}`} className="block">
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="h-40 overflow-hidden">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 ${getStatusColor(event.status)}`}>
              {getStatusText(event.status)}
            </span>
            <h3 className="text-lg font-semibold mb-1 truncate">{event.title}</h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(event.date)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/events/${event.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="h-48 overflow-hidden relative">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          />
          <span className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
            {getStatusText(event.status)}
          </span>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-blue-600" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-blue-600" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2 text-blue-600" />
              <span>{event.registeredCount} / {event.capacity} registered</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {event.capacity - event.registeredCount} spots left
            </span>
            <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition duration-150">
              View Details
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;