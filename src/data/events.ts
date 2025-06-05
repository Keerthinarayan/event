import { Event } from '../types';

export const events: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2025',
    description: 'Join us for the biggest tech conference of the year featuring industry leaders and innovative workshops.',
    date: '2025-06-15T09:00:00Z',
    location: 'Silicon Valley Convention Center',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    organizerId: 'org1',
    capacity: 500,
    registeredCount: 342,
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Digital Marketing Summit',
    description: 'Learn the latest digital marketing strategies from top marketing professionals.',
    date: '2025-05-20T10:00:00Z',
    location: 'New York Business Center',
    image: 'https://images.pexels.com/photos/7709020/pexels-photo-7709020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    organizerId: 'org2',
    capacity: 300,
    registeredCount: 275,
    status: 'present'
  },
  {
    id: '3',
    title: 'Design Innovation Workshop',
    description: 'A hands-on workshop focused on innovative design thinking and modern UX practices.',
    date: '2025-04-05T14:00:00Z',
    location: 'San Francisco Design Hub',
    image: 'https://images.pexels.com/photos/7256897/pexels-photo-7256897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    organizerId: 'org1',
    capacity: 100,
    registeredCount: 100,
    status: 'present'
  },
  {
    id: '4',
    title: 'Startup Funding Conference',
    description: 'Connect with investors and learn how to secure funding for your startup.',
    date: '2025-01-30T09:00:00Z',
    location: 'Miami Entrepreneurship Center',
    image: 'https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    organizerId: 'org3',
    capacity: 250,
    registeredCount: 230,
    status: 'past'
  },
  {
    id: '5',
    title: 'AI and Machine Learning Conference',
    description: 'Explore the cutting edge of AI and machine learning with industry experts.',
    date: '2025-07-22T08:30:00Z',
    location: 'Seattle Tech Campus',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    organizerId: 'org2',
    capacity: 400,
    registeredCount: 180,
    status: 'upcoming'
  },
  {
    id: '6',
    title: 'Web Development Bootcamp',
    description: 'Intensive two-day bootcamp covering the latest web development technologies and best practices.',
    date: '2025-03-15T09:00:00Z',
    location: 'Chicago Code Academy',
    image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    organizerId: 'org1',
    capacity: 150,
    registeredCount: 150,
    status: 'past'
  }
];