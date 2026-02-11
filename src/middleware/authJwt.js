require('dotenv').config();

const config = require("../config/auth");
const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
    let authHeader = req.headers[config.header.toLowerCase()];
    
    if (!authHeader) {
        return res.status(403).send({ message: "No token provided" });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) return res.status(401).send({ message: "Unauthorized" });
        
        req.user = { id: decoded.sub, role: decoded.role };        
        next();
    });
};

const authJwt = {
    verifyToken: verifyToken,
};


module.exports = authJwt;