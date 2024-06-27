// utils/multerConfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create directories if they don't exist
const createDirectory = (dir) => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
};

// file destination
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadDir = 'uploads/';

        if (file.fieldname === 'profileImage') {
            uploadDir += 'profileImage/';
        } else if (file.fieldname === 'blogImage') {
            uploadDir += 'blogImage/';
        }

        createDirectory(uploadDir);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Configure file filter to validate file types
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images are allowed.'));
    }
};

// Multer middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    fileFilter: fileFilter
});

module.exports = upload;
