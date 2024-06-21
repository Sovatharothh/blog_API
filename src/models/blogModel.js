const mongoose = require('mongoose');
const shortid = require('shortid');

const blogSchema = new mongoose.Schema({
    blogId: {
        type: String,
        default: shortid.generate,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    author:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,     
    },
    publishedAt: {
        type: Date,
        default: Date.now,
    },

    blogImage: {
        type: String,
        required: true,
    },
});

// before save
blogSchema.pre('save', function (next){
    this.updatedAt = new Date();
    next();
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;