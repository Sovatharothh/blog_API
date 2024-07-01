const asyncHandler = require('express-async-handler');
const Blog = require('../models/blogModel');
const AppError = require('../utils/AppError');
const validateFields = require('../utils/validateFields');

// create new blog
const createBlog = asyncHandler(async (req, res, next) => {
    const { title, description, author } = req.body;
    const blogImage = req.file ? req.file.path : null;


    // validate required fields
    const fieldsToValidate = [
        { name: 'title', value: title },
        { name: 'description', value: description },
        { name: 'author', value: author },
        { name: 'blogImage', value: blogImage }
    ];

    const validationResult = validateFields(fieldsToValidate);
    if (validationResult.error){
        return next(new AppError(validationResult.message, 400));
    }

    const newBlog = new Blog({
        title,
        description,
        author,
        blogImage
    });

    // save new blog
    const savedBlog = await newBlog.save();

    res.status(201).json({
        status: 201,
        message: 'Blog created successfully TT',
        blog: savedBlog
    });
});


// get all blog
const getAllBlog = asyncHandler(async(req, res, next)=> {
    const blogs = await Blog.find();

    res.status(200).json({
        status: 200,
        message: 'Blogs fetched successfully',
        data: blogs

    });
});


// get blog by ID
const getBlogById = asyncHandler(async(req, res, next)=> {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return next(new AppError('Blog not found', 404));
    }

    res.status(200).json({
        status: 200,
        message: 'Blog fetched sucessfully',
        data: blog
    });
});

// update blog by ID
const updateBlogById = asyncHandler(async(req, res, next) => {
    const {title, description, author} = req.body;
    const blogImage = req.file ? req.file.path : req.body.blogImage;


    // validate required fields
    const fieldsToValidate = [
        { name: 'title', value: title },
        { name: 'description', value: description },
        { name: 'author', value: author },
        { name: 'blogImage', value: blogImage}
    ];

    const validationResult = validateFields(fieldsToValidate);
    if (validationResult.error){
        return next(new AppError(validationResult.message, 400));
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return next(new AppError('Blog not found', 404));
    }

    blog.title = title,
    blog.description = description,
    blog.author = author,
    blog.blogImage = blogImage,
    blog.updatedAt = new Date();


    const updatedBlog = await blog.save();

    res.status(200).json({
        status: 200,
        message: 'Blog updated successfully',
        blog: updatedBlog
    });
});

// delete blog by ID
const deleteBlogById = asyncHandler(async(req, res, next) => {
    const blog = await Blog.findById(req.params.id);

    if(!blog){
        return next(new AppError('Blog not found', 404));

    }

    await blog.remove();

    res.status(204).json({
        status: 204,
        message: 'Blog deleted successfulluy',
    });
});

module.exports = {
    createBlog,
    getAllBlog,
    getBlogById, 
    updateBlogById,
    deleteBlogById
};


