const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const splitToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
        const decoded = jwt.verify(splitToken, process.env.JWT_SECRET);
        req.user = decoded;
        // Normalize req.user.user.id so both local and OAuth payloads work seamlessly
        if (req.user && !req.user.user) {
            req.user.user = { id: decoded.id || decoded._id };
        }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
