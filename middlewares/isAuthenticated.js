const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");




const isAuthenticated = (secretKey) => (req, res, next) => {
    const token = req.headers['authorization'] || req.cookies.Authorization;
    
    
    if (!token) {
        throw new ApiError(401, 'Unauthorized: Missing token');

    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            throw new ApiError(403, 'Forbidden: Invalid token');

        }
        req.user = user;
        next();
    });
};

module.exports = isAuthenticated