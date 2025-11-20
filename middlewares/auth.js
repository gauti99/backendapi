const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Driver = require('../models/Driver');

const verifyToken = (roles = []) => {
    if (typeof roles === 'string') roles = [roles];

    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'No token provided' });
            }

            const token = authHeader.split(' ')[1];
            const payload = jwt.verify(token, process.env.JWT_SECRET);

            // ADMIN BLOCK
            if (payload.type === 'admin') {
                const admin = await Admin.findById(payload.id).select('-password');
                if (!admin) {
                    return res.status(401).json({ message: 'Invalid token' });
                }
                req.user = admin; // attach to request
            }

            // DRIVER BLOCK
            if (payload.type === 'driver') {
                const driver = await Driver.findById(payload.id).select('-password');
                if (!driver) {
                    return res.status(401).json({ message: 'Invalid token' });
                }
                req.user = driver;
            }

            // ROLE CHECK
            if (roles.length > 0 && !roles.includes(payload.type)) {
                return res.status(403).json({ message: 'Access denied' });
            }

            next();

        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
};

module.exports = verifyToken;
