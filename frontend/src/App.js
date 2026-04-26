import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Hackathons from './pages/Hackathons';
import Teams from './pages/Teams';
import Dashboard from './pages/Dashboard';
import HackathonDetails from './pages/HackathonDetails';
import Chat from './pages/Chat';
import EditProfile from './pages/EditProfile';
import './App.css';

// Simple guard to redirect logged-in users away from public pages
const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// Guard to protect internal pages from unauthenticated users
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/signup" replace />;
};

const AppContent = () => {
  const location = useLocation();
  const isChat = location.pathname === '/chat';

  return (
    <div className={`App flex flex-col font-sans antialiased ${isChat ? 'h-screen overflow-hidden' : 'min-h-screen'} bg-slate-50 text-slate-800 transition-colors duration-300 dark:text-slate-200 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-slate-900 dark:via-[#0f172a] dark:to-black`}>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/signup" element={<Navigate to="/register" replace />} />

        {/* Protected Routes */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/hackathons" element={<ProtectedRoute><Hackathons /></ProtectedRoute>} />
        <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/hackathon/:id" element={<ProtectedRoute><HackathonDetails /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
