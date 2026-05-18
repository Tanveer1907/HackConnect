const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
    const token = req.cookies.admin_token;
    
    if (!token) {
        // If they are accessing an EJS view directly and are not logged in,
        // redirect them to the frontend login page.
        return res.redirect('http://localhost:3000/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.role !== 'admin') {
            return res.redirect('http://localhost:3000/login');
        }

        req.admin = decoded;
        next();
    } catch (err) {
        console.error('Admin Auth Error:', err);
        return res.redirect('http://localhost:3000/login');
    }
};

module.exports = isAdmin;
