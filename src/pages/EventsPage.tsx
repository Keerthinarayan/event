import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import EventList from '../components/EventList';
import EventCard from '../components/EventCard';
import { Search, Filter, Calendar, MapPin, Tag } from 'lucide-react';

const EventsPage: React.FC = () => {
  const { events } = useEvents();
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'present' | 'past'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredEvents = events.filter(event => {
    // Filter by tab
    if (activeTab !== 'all' && event.status !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Events</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find and join amazing events happening around the world. 
            Filter by date, location, or search for specific events.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="relative flex-grow mb-4 md:mb-0">
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150"
            >
              <Filter className="h-5 w-5 mr-2 text-gray-500" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <select className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Dates</option>
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <select className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Locations</option>
                  <option value="san-francisco">San Francisco</option>
                  <option value="new-york">New York</option>
                  <option value="seattle">Seattle</option>
                  <option value="chicago">Chicago</option>
                  <option value="miami">Miami</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-gray-500" />
                <select className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Categories</option>
                  <option value="tech">Technology</option>
                  <option value="business">Business</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="career">Career</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setActiveTab('present')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'present'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Happening Now
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upcoming'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'past'
                  ? 'border-gray-500 text-gray-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Past Events
            </button>
          </nav>
        </div>

        {/* Event Listings */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <div key={event.id} className="animate-fadeIn">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setActiveTab('all');
              }}
              className="mt-4 text-blue-600 hover:text-blue-800 transition duration-150"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;