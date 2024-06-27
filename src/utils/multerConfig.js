// utils/multerConfig.js
const multer = require('multer');
const path = require('path');

// Configure storage settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set the destination for uploaded files
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Set the file name for uploaded files
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Configure file filter to validate file types
const fileFilter = (req, file, cb) => {
    // Allow only specific file types (e.g., images)
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images are allowed.'));
    }
};

// Set up Multer middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    fileFilter: fileFilter
});

module.exports = upload;
