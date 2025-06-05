import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import EventsPage from './pages/EventsPage';
import EventDetails from './pages/EventDetails';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserDashboard from './pages/dashboard/UserDashboard';
import OrganizerDashboard from './pages/dashboard/OrganizerDashboard';
import CreateEvent from './pages/dashboard/CreateEvent';

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
                <Route path="/organizer/create-event" element={<CreateEvent />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;