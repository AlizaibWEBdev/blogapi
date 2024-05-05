const authrouter = require("express").Router();
const authController = require("../controllers/auth.controller")








authrouter.post("/login", authController.login)
authrouter.post("/signup", authController.signup)
authrouter.post("/get-token", authController.givNewAccessToken)


module.exports = authrouter




