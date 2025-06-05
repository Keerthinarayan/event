import React from 'react';
import Hero from '../components/Hero';
import EventList from '../components/EventList';
import { useEvents } from '../context/EventContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { getEventsByStatus } = useEvents();
  
  const upcomingEvents = getEventsByStatus('upcoming').slice(0, 4);
  const presentEvents = getEventsByStatus('present').slice(0, 4);
  const pastEvents = getEventsByStatus('past').slice(0, 4);

  return (
    <div>
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Events</h2>
            <Link 
              to="/events" 
              className="flex items-center text-blue-600 hover:text-blue-800 transition duration-150"
            >
              View all events <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {presentEvents.length > 0 ? (
              presentEvents.slice(0, 3).map(event => (
                <Link key={event.id} to={`/events/${event.id}`} className="group">
                  <div className="relative h-64 overflow-hidden rounded-lg shadow-md">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                      <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full mb-2">
                        Happening Now
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                      <p className="text-gray-200">{event.location}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No featured events available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {presentEvents.length > 0 && (
          <EventList 
            events={presentEvents} 
            title="Happening Now" 
            compact
          />
        )}
        
        <EventList 
          events={upcomingEvents} 
          title="Upcoming Events" 
        />
        
        <EventList 
          events={pastEvents} 
          title="Past Events" 
          compact
        />

        <section className="mt-16 bg-blue-50 rounded-xl p-8 md:p-12">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Want to organize your own event?
              </h2>
              <p className="text-lg text-gray-600 mb-6 md:mb-0">
                Join as an organizer and create your own events. Manage registrations, 
                send updates, and connect with attendees.
              </p>
            </div>
            <div className="md:w-1/3 md:text-right">
              <Link 
                to="/register" 
                className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150"
              >
                Become an Organizer
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;