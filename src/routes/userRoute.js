const express = require('express');
const { check, validationResult } = require('express-validator');
const { registerUser, userLogin, resetPassword, refreshAccessToken } = require('../controllers/userController');

const router = express.Router();

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Register API
router.post('/register', [
    check('firstName', 'First name is required').notEmpty(),
    check('lastName', 'Last name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    check('profileImage', 'Please upload your profile image').notEmpty(),
], handleValidationErrors, registerUser);

// Login API
router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
], handleValidationErrors, userLogin);

// Reset New Password API
router.post('/reset-password', [
    check('email', 'Please include a valid email').isEmail(),
    check('newPassword', 'New password must be 6 or more characters').isLength({ min: 6 }),
], handleValidationErrors, resetPassword);

// Refresh Token API
router.post('/refresh-token', (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }
    next();
}, refreshAccessToken);

module.exports = router;
