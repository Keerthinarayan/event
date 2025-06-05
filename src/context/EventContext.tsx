import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, EventApplication } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface EventContextType {
  events: Event[];
  applications: EventApplication[];
  addEvent: (event: Omit<Event, 'id' | 'registeredCount' | 'status'>) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  registerForEvent: (eventId: string) => Promise<void>;
  getEventsByStatus: (status: 'upcoming' | 'present' | 'past') => Event[];
  getUserRegistrations: () => EventApplication[];
  getOrganizerEvents: () => Event[];
}

const EventContext = createContext<EventContextType | null>(null);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
    if (user) {
      fetchUserRegistrations();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      const transformedEvents = data.map(event => ({
        ...event,
        organizerId: event.organizer_id,
        registeredCount: event.registered_count,
      }));

      setEvents(transformedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchUserRegistrations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const registrations = data.map(reg => ({
        id: reg.id,
        eventId: reg.event_id,
        userId: reg.user_id,
        status: 'approved' as const,
        appliedAt: reg.created_at
      }));

      setApplications(registrations);
    } catch (error) {
      console.error('Error fetching user registrations:', error);
    }
  };

  const addEvent = async (eventData: Omit<Event, 'id' | 'registeredCount' | 'status'>) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const status = new Date(eventData.date) > new Date() ? 'upcoming' : 'present';
      
      const dbEventData = {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        location: eventData.location,
        image: eventData.image,
        organizer_id: user.id,
        capacity: eventData.capacity,
        registered_count: 0,
        status
      };

      const { data, error } = await supabase
        .from('events')
        .insert([dbEventData])
        .select()
        .single();

      if (error) throw error;

      const newEvent = {
        ...data,
        organizerId: data.organizer_id,
        registeredCount: data.registered_count,
      };

      setEvents(prev => [...prev, newEvent]);
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  };

  const updateEvent = async (updatedEvent: Event) => {
    try {
      const dbEventData = {
        title: updatedEvent.title,
        description: updatedEvent.description,
        date: updatedEvent.date,
        location: updatedEvent.location,
        image: updatedEvent.image,
        organizer_id: updatedEvent.organizerId,
        capacity: updatedEvent.capacity,
        registered_count: updatedEvent.registeredCount,
        status: updatedEvent.status
      };

      const { error } = await supabase
        .from('events')
        .update(dbEventData)
        .eq('id', updatedEvent.id);

      if (error) throw error;
      
      await fetchEvents(); // Refresh events to get updated data
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const registerForEvent = async (eventId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const event = events.find(e => e.id === eventId);
      if (!event) throw new Error('Event not found');
      
      if (event.registeredCount >= event.capacity) {
        throw new Error('Event is at full capacity');
      }

      const { error } = await supabase
        .from('registrations')
        .insert([
          { event_id: eventId, user_id: user.id }
        ]);

      if (error) throw error;

      // Refresh events and registrations
      await Promise.all([
        fetchEvents(),
        fetchUserRegistrations()
      ]);
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  };

  const getEventsByStatus = (status: 'upcoming' | 'present' | 'past') => {
    return events.filter(event => event.status === status);
  };

  const getUserRegistrations = () => {
    if (!user) return [];
    return applications.filter(app => app.userId === user.id);
  };

  const getOrganizerEvents = () => {
    if (!user || user.role !== 'organizer') return [];
    return events.filter(event => event.organizerId === user.id);
  };

  return (
    <EventContext.Provider value={{
      events,
      applications,
      addEvent,
      updateEvent,
      registerForEvent,
      getEventsByStatus,
      getUserRegistrations,
      getOrganizerEvents
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};