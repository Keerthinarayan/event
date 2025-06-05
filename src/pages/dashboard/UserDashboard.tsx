import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, X } from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { applications, events } = useEvents();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please log in to view your dashboard.</p>
          <Link to="/login" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  const userApplications = applications.filter(app => app.userId === user.id);
  
  const getEventById = (eventId: string) => {
    return events.find(event => event.id === eventId);
  };

  const appliedEvents = userApplications.map(app => {
    const event = getEventById(app.eventId);
    return {
      ...app,
      event
    };
  });

  const upcomingApplications = appliedEvents.filter(app => 
    app.event && app.event.status !== 'past'
  );
  
  const pastApplications = appliedEvents.filter(app => 
    app.event && app.event.status === 'past'
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Welcome, {user.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your event applications and registrations
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              to="/events"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Browse Events
            </Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'upcoming'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Upcoming Events
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'past'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Past Events
              </button>
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === 'upcoming' ? (
              upcomingApplications.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {upcomingApplications.map(app => (
                    <div key={app.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-200">
                      {app.event && (
                        <>
                          <div className="h-36 overflow-hidden">
                            <img 
                              src={app.event.image} 
                              alt={app.event.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <div className="mb-2">
                              {getStatusBadge(app.status)}
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-900">{app.event.title}</h3>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{formatDate(app.event.date)}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{app.event.location}</p>
                            <Link 
                              to={`/events/${app.event.id}`}
                              className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition duration-150"
                            >
                              View Details
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No upcoming events</h3>
                  <p className="mt-1 text-sm text-gray-500">You haven't applied to any upcoming events yet.</p>
                  <div className="mt-6">
                    <Link
                      to="/events"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Browse Events
                    </Link>
                  </div>
                </div>
              )
            ) : (
              pastApplications.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {pastApplications.map(app => (
                    <div key={app.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-200">
                      {app.event && (
                        <>
                          <div className="relative h-36 overflow-hidden">
                            <img 
                              src={app.event.image} 
                              alt={app.event.title} 
                              className="w-full h-full object-cover filter grayscale opacity-80"
                            />
                            <div className="absolute top-2 right-2 px-2 py-1 bg-gray-800 text-white text-xs font-medium rounded">
                              Past Event
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="mb-2">
                              {getStatusBadge(app.status)}
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-900">{app.event.title}</h3>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{formatDate(app.event.date)}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{app.event.location}</p>
                            <Link 
                              to={`/events/${app.event.id}`}
                              className="inline-block px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition duration-150"
                            >
                              View Details
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No past events</h3>
                  <p className="mt-1 text-sm text-gray-500">You haven't attended any past events yet.</p>
                </div>
              )
            )}
          </div>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {userApplications.length > 0 ? (
              userApplications.slice(0, 5).map(app => {
                const event = getEventById(app.eventId);
                return (
                  <li key={app.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {app.status === 'approved' ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ) : app.status === 'rejected' ? (
                          <X className="h-5 w-5 text-red-500 mr-2" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                        )}
                        <p className="text-sm font-medium text-gray-900">
                          {app.status === 'approved' 
                            ? 'Application approved' 
                            : app.status === 'rejected'
                              ? 'Application rejected'
                              : 'Application pending'
                          }
                          {event && (
                            <span className="ml-1 text-gray-500">
                              for <Link to={`/events/${event.id}`} className="text-blue-600 hover:text-blue-800">{event.title}</Link>
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-6 sm:px-6 text-center text-gray-500">
                No recent activity
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;