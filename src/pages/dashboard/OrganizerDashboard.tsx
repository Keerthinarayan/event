import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Edit, Plus, Trash2, Users, XCircle, CheckCircle } from 'lucide-react';

const OrganizerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { events, applications, getOrganizerEvents, updateApplicationStatus } = useEvents();
  const [activeTab, setActiveTab] = useState<'events' | 'applications'>('events');
  const navigate = useNavigate();

  if (!user || user.role !== 'organizer') {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need to be logged in as an organizer to view this page.</p>
          <Link to="/login" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150">
            Log In as Organizer
          </Link>
        </div>
      </div>
    );
  }

  const organizerEvents = getOrganizerEvents();
  
  const pendingApplications = applications.filter(app => {
    const event = events.find(e => e.id === app.eventId);
    return event?.organizerId === user.id && app.status === 'pending';
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  const handleApprove = (applicationId: string) => {
    updateApplicationStatus(applicationId, 'approved');
  };

  const handleReject = (applicationId: string) => {
    updateApplicationStatus(applicationId, 'rejected');
  };

  const getEventById = (eventId: string) => {
    return events.find(event => event.id === eventId);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Organizer Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your events and review applications
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => navigate('/organizer/create-event')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Event
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('events')}
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'events'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Events
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'applications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } relative`}
              >
                Pending Applications
                {pendingApplications.length > 0 && (
                  <span className="absolute top-2 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {pendingApplications.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {activeTab === 'events' ? (
            <div className="p-4 sm:p-6">
              {organizerEvents.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {organizerEvents.map(event => (
                    <div key={event.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-200">
                      <div className="h-36 overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                            event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            event.status === 'present' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.status === 'upcoming' ? 'Upcoming' : 
                             event.status === 'present' ? 'Happening Now' : 'Past'}
                          </span>
                          <div className="flex space-x-1">
                            <button className="p-1 text-gray-500 hover:text-blue-600 transition duration-150">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-500 hover:text-red-600 transition duration-150">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">{event.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{event.registeredCount} / {event.capacity} registered</span>
                        </div>
                        <Link 
                          to={`/events/${event.id}`}
                          className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition duration-150"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No events created</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating your first event.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/organizer/create-event')}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Event
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 sm:p-6">
              {pendingApplications.length > 0 ? (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col\" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Event
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Date Applied
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {pendingApplications.map(application => {
                        const event = getEventById(application.eventId);
                        return event ? (
                          <tr key={application.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img 
                                    className="h-10 w-10 rounded-full object-cover" 
                                    src={event.image} 
                                    alt={event.title}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="font-medium text-gray-900">{event.title}</div>
                                  <div className="text-gray-500">{formatDate(event.date)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {new Date(application.appliedAt).toLocaleDateString()}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <div className="flex space-x-2 justify-end">
                                <button
                                  onClick={() => handleApprove(application.id)}
                                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(application.id)}
                                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : null;
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No pending applications</h3>
                  <p className="mt-1 text-sm text-gray-500">All applications have been processed.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Event Statistics</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-md bg-blue-50 text-blue-700">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
                    <p className="text-2xl font-semibold text-gray-900">{organizerEvents.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-md bg-green-50 text-green-700">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Registrations</h3>
                    <p className="text-2xl font-semibold text-gray-900">
                      {organizerEvents.reduce((sum, event) => sum + event.registeredCount, 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-md bg-purple-50 text-purple-700">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Upcoming Events</h3>
                    <p className="text-2xl font-semibold text-gray-900">
                      {organizerEvents.filter(event => event.status === 'upcoming').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;