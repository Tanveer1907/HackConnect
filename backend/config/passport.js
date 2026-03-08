const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../src/models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-google-client-id',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-google-client-secret',
            callbackURL: 'http://localhost:5000/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    return done(null, user);
                }

                // If not, create a new user inside DB
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: 'oauth-login-no-password', // Placeholder since it's required in schema
                    profileImage: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
                    authProvider: 'google',
                    role: 'developer'
                });

                done(null, user);
            } catch (err) {
                console.error(err);
                done(err, null);
            }
        }
    )
);

// GitHub Strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID || 'dummy-github-client-id',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy-github-client-secret',
            callbackURL: 'http://localhost:5000/api/auth/github/callback',
            scope: ['user:email']
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Extract email from profile
                let email = profile.emails && profile.emails[0] && profile.emails[0].value;
                if (!email) {
                    // Fallback email since github might not provide one publicly
                    email = `${profile.username}@github.placeholder.com`;
                }

                let user = await User.findOne({ email });

                if (user) {
                    return done(null, user);
                }

                user = await User.create({
                    name: profile.displayName || profile.username,
                    email,
                    password: 'oauth-login-no-password',
                    profileImage: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
                    authProvider: 'github',
                    role: 'developer'
                });

                done(null, user);
            } catch (err) {
                console.error(err);
                done(err, null);
            }
        }
    )
);

module.exports = passport;
