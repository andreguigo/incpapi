require('dotenv').config();

module.exports = {
    secret: process.env.JWT_SECRET_KEY,
    header: process.env.JWT_HEADER_KEY || 'Authorization',
    jwtExpiration: 3600,           // 1 hour
    jwtRefreshExpiration: 86400,   // 24 hours
};