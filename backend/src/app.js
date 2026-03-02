const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const hackathonRoutes = require('./routes/hackathon.routes');
const teamRoutes = require('./routes/team.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/team', teamRoutes);

module.exports = app;
