const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    author_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "user"
    },
    blog_id: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    upload: {
        type: Boolean,
        default: false
    },
  
    image: {
        type: String, 
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("blog", blogSchema);
