// controllers/uploadController.js
const asyncHandler = require('express-async-handler');
const uploadService = require('../services/uploadService');
const AppError = require('../utils/AppError');

// Handle profile image upload
const uploadProfileImage = asyncHandler(async (req, res, next) => {
    try {
        const filePath = uploadService.uploadFile(req.file);
        res.status(200).json({
            status: 200,
            message: 'Profile image uploaded successfully',
            filePath: filePath
        });
    } catch (error) {
        next(error);
    }
});

// Handle blog image upload
const uploadBlogImage = asyncHandler(async (req, res, next) => {
    try {
        const filePath = uploadService.uploadFile(req.file);
        res.status(200).json({
            status: 200,
            message: 'Blog image uploaded successfully',
            filePath: filePath
        });
    } catch (error) {
        next(error);
    }
});

module.exports = {
    uploadProfileImage,
    uploadBlogImage
};
