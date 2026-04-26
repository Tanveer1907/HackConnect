const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const hackathonRoutes = require('./routes/hackathonRoutes');
const teamRoutes = require('./routes/teamRoutes');
const chatRoutes = require('./routes/chatRoutes');
const errorHandler = require('./middleware/errorHandler');
const app = express();

// EJS Template Engine setup (SSR)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

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

// SSR Route - EJS Template Demo
app.get('/status', (req, res) => {
    res.render('status', {
        title: 'HackConnect Server Status',
        env: process.env.NODE_ENV || 'development',
        uptime: Math.floor(process.uptime()),
        routes: ['/api/auth', '/api/users', '/api/hackathons', '/api/team', '/api/chat']
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/chat', chatRoutes);

// Error-handling middleware (must be LAST)
app.use(errorHandler);

module.exports = app;
