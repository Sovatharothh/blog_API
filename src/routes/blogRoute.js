const express = require('express');
const { createBlog, getAllBlog, getBlogById, updateBlogById, deleteBlogById } = require('../controllers/blogController');

const router = express.Router();
router.post('/', createBlog);
router.get('', getAllBlog);
router.get('/:id', getBlogById);
router.put('/:id', updateBlogById);
router.delete('/:id', deleteBlogById);

module.exports = router;