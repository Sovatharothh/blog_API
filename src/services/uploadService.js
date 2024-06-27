// services/uploadService.js
const AppError = require('../utils/AppError');

const uploadFile = (file) => {
    if (!file) {
        throw new AppError('No file uploaded', 400);
    }
    return file.path;
};

module.exports = {
    uploadFile,
};
