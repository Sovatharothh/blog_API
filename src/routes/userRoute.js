const express = require('express');
const { check } = require('express-validator');
const { registerUser, userLogin, resetPassword, refreshAccessToken } = require('../controllers/userController');

const router = express.Router();

// Register API
router.post('/register', [
    check('firstName', 'First name is required').notEmpty(),
    check('lastName', 'Last name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
], registerUser);

// Login API
router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
], userLogin);

// Reset New Password API
router.post('/reset-password', [
    check('email', 'Please include a valid email').isEmail(),
    check('newPassword', 'New password must be 6 or more characters').isLength({ min: 6 }),
], resetPassword);

// Refresh Token API
router.post('/refresh-token', (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }
    next();
}, refreshAccessToken);

module.exports = router;
