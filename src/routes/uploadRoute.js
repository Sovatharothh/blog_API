// routes/uploadRoutes.js
const express = require('express');
const upload = require('../utils/multerConfig');
const { uploadProfileImage, uploadBlogImage } = require('../controllers/uploadController');

const router = express.Router();

router.post('/profileImage', upload.single('profileImage'), uploadProfileImage);
router.post('/blogImage', upload.single('blogImage'), uploadBlogImage);

module.exports = router;
