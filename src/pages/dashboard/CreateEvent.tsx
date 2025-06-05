import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import { Calendar, MapPin, Clock, Users, Image as ImageIcon, Info, X } from 'lucide-react';

const CreateEvent: React.FC = () => {
  const { user } = useAuth();
  const { addEvent } = useEvents();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: 100,
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user || user.role !== 'organizer') {
    navigate('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.capacity <= 0) newErrors.capacity = 'Capacity must be greater than 0';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const dateTime = new Date(`${formData.date}T${formData.time}`);
    
    const newEvent = {
      title: formData.title,
      description: formData.description,
      date: dateTime.toISOString(),
      location: formData.location,
      image: formData.image,
      organizerId: user.id,
      capacity: Number(formData.capacity),
      registeredCount: 0,
      status: dateTime > new Date() ? 'upcoming' : 'present' as 'upcoming' | 'present' | 'past'
    };
    
    addEvent(newEvent);
    navigate('/organizer/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
          <p className="mt-2 text-gray-600">Fill in the details below to create your event</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          {/* Event Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Event Title*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`pl-10 block w-full shadow-sm sm:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Tech Conference 2025"
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Event Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Event Description*
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <Info className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={`pl-10 block w-full shadow-sm sm:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Provide a detailed description of your event..."
              />
            </div>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Event Date*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`pl-10 block w-full shadow-sm sm:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Event Time*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`pl-10 block w-full shadow-sm sm:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.time ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Location and Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Event Location*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`pl-10 block w-full shadow-sm sm:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., San Francisco Convention Center"
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                Capacity*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  className={`pl-10 block w-full shadow-sm sm:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.capacity ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
              )}
            </div>
          </div>

          {/* Event Image */}
          <div className="mb-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Event Image URL*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ImageIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className={`pl-10 block w-full shadow-sm sm:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.image ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter image URL"
              />
            </div>
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image}</p>
            )}
            
            {/* Image Preview */}
            {formData.image && (
              <div className="mt-3">
                <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                <div className="relative h-40 w-full bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={formData.image} 
                    alt="Event preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                      setErrors(prev => ({ ...prev, image: 'Invalid image URL' }));
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/organizer/dashboard')}
              className="mr-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;