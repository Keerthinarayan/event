export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'organizer';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  organizerId: string;
  capacity: number;
  registeredCount: number;
  status: 'upcoming' | 'present' | 'past';
  registrationFee: number;
}

export interface EventApplication {
  id: string;
  eventId: string;
  userId: string;
  status: 'approved';
  appliedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
