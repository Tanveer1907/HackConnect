import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Hackathons from './pages/Hackathons';
import Teams from './pages/Teams';
import Dashboard from './pages/Dashboard';
import HackathonDetails from './pages/HackathonDetails';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App font-sans antialiased text-gray-900 bg-gray-50 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/hackathons" element={<Hackathons />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hackathon/:id" element={<HackathonDetails />} />

          <Route path="/signup" element={<Navigate to="/register" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
