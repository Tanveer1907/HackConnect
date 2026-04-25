import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import './App.css';

// Simple guard to redirect logged-in users away from public pages
const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="App flex flex-col font-sans antialiased min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:text-slate-200 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-slate-900 dark:via-[#0f172a] dark:to-black">
        <Navbar />
        <Routes>
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/hackathons" element={<Hackathons />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hackathon/:id" element={<HackathonDetails />} />
          <Route path="/chat" element={<Chat />} />

          <Route path="/signup" element={<Navigate to="/register" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;
