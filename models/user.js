const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshtoken: {
        type: String,
        default: ""
    },
    interests: {
        type: Array,
        default: ["sport", "computer", "fitness", "news", "love", "general", "all"]
    },
    dob: {
        type: Date,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: "hey there, I am using Blogii"
    },
    liked_posts: [{
        type: mongoose.Schema.ObjectId,
        ref: "blog"
    }],
    saved_posts: [{
        type: mongoose.Schema.ObjectId,
        ref: "blog"
    }]
});

module.exports = mongoose.model("user", userSchema);
