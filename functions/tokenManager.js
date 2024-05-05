const jwt = require("jsonwebtoken")
const generateToken = (payload, secretKey, expiresIn = '10h') => {
    return jwt.sign(payload, secretKey, { expiresIn });
};

const verifytoken = (token, secretKey) => {
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return false;
        } else {

            return user;
        }

    });

}

module.exports = {
    generateToken,
    verifytoken
}