const Blog = require('../models/blogModel');

// create new blog
const createBlog = async (blogId, title, description, author, createdAt, updatedAt, publishedAt, blogImage ) =>{
    const blog = await Blog.create({blogId, title, description, author, createdAt, updatedAt, publishedAt, blogImage });
    return blog;
}


// get all blog
const getAllBlog = async () =>{
    const blog = await Blog.findAll({where: {_id}});
    return blog;

}
;

// get blog by ID
const getBlogById = async (_id, blogId) =>{
    const blog = await Blog.findOne({where: { id: blogId, _id}});
    if (!blog) throw new Error('Blog not found...');
    return blog;
};

// update blog by ID
const updateBlogById = async (blogId,title, description, author, createdAt, updatedAt, publishedAt, blogImage) => {
    const blog = await Blog.findOne({where: { id: blog, _id}});
    if (!blog) throw new Error('Blog not found');

    blog.blogId = blogId;
    blog.title = title;
    blog.description = description;
    blog.author = author;
    blog.createdAt = createdAt;
    blog.updatedAt = updatedAt;
    blog.publishedAt = publishedAt;
    blog.blogImage = blogImage;

    await blog.save();
    return blog;
};

// delete blog by ID
const deleteBlogbyId = async (blogId, _id) => {
    const blog = await Blog.findOne({where: {id: blog, _id}});
    if (!blog) throw new Error('Blog not found');

    await blog.destroy();
    return blog;
};

module.exports = {
    createBlog,
    getAllBlog,
    getBlogById,
    updateBlogById,
    deleteBlogbyId,
};


