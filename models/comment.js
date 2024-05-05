const mongoose = require("mongoose")
const commentSchema = mongoose.Schema({
    what: {
        type: String,
        required: true,

    },
    commentBy: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "user"
    },
    userlikes: {
        type: Number,
        default: 0,
    }

}, {
    timestamps: true
});

module.exports = commentSchema;