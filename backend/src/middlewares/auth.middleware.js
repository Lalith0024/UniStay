const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({
            message: 'Unauthorized, JWT token is required',
            success: false
        });
    }
    let token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    if (!token) {
        return res.status(403).json({
            message: 'Unauthorized, JWT token is required',
            success: false
        });
    }
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not configured in middleware');
        return res.status(500).json({
            message: 'Server configuration error',
            success: false,
            error: 'JWT_SECRET not configured'
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        let errorMessage = 'Unauthorized, JWT token wrong or expired';
        if (err.name === 'TokenExpiredError') {
            errorMessage = 'JWT token has expired';
        } else if (err.name === 'JsonWebTokenError') {
            errorMessage = 'Invalid JWT token';
        } else if (err.name === 'NotBeforeError') {
            errorMessage = 'JWT token not active';
        }
        return res.status(403).json({
            message: errorMessage,
            success: false,
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

module.exports = ensureAuthenticated;