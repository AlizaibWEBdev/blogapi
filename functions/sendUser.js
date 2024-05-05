const user = require("../models/user")
const ApiError = require("../utils/ApiError")
async function sendUser(req, res, next) {

    const userInfo = await user.findOne({ _id: req.user?.id || req.query.id }).select("-email -password -refreshtoken -interests");

    if (userInfo) {
        res.status(200).json({
            name: userInfo.name,
            image: userInfo.image
        })

    } else {
        next(new ApiError(400, 'please enter valid id'))
    }
}

module.exports = sendUser;