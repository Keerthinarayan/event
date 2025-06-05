import React from 'react';
import { Event } from '../types';
import EventCard from './EventCard';

interface EventListProps {
  events: Event[];
  title: string;
  compact?: boolean;
}

const EventList: React.FC<EventListProps> = ({ events, title, compact = false }) => {
  if (events.length === 0) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-500">No events found in this category.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
      <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
        {events.map(event => (
          <EventCard key={event.id} event={event} compact={compact} />
        ))}
      </div>
    </div>
  );
};

export default EventList;