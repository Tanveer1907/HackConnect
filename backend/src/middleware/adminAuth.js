const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
    const token = req.cookies.admin_token;
    
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
