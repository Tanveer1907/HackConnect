const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
    let token = req.cookies.admin_token;
    
    // Fallback for Safari ITP (Intelligent Tracking Prevention)
    // If cookie was blocked cross-domain, grab token from URL query string
    if (!token && req.query.token) {
        token = req.query.token;
        // Set it as a first-party cookie now that we are on the Railway domain
        res.cookie('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 12 * 60 * 60 * 1000 // 12 hours
        });
    }
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    if (!token) {
        // If they are accessing an EJS view directly and are not logged in,
        // redirect them to the frontend login page.
        return res.redirect(`${frontendUrl}/login`);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.role !== 'admin') {
            return res.redirect(`${frontendUrl}/login`);
        }

        req.admin = decoded;
        next();
    } catch (err) {
        console.error('Admin Auth Error:', err);
        return res.redirect(`${frontendUrl}/login`);
    }
};

module.exports = isAdmin;
