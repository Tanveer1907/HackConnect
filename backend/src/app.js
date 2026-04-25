const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const hackathonRoutes = require('./routes/hackathonRoutes');
const teamRoutes = require('./routes/teamRoutes');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

const session = require('express-session');
const passport = require('../config/passport');

app.use(session({
    secret: process.env.SESSION_SECRET || 'hackconnect_secret',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/team', teamRoutes);
module.exports = app;
