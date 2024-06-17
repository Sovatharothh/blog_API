const express = require('express');
const { check, validationResult } = require('express-validator');
const { registerUser, loginUser, resetPassword } = require('../controllers/userController');

const router = express.Router();

router.post('/register', [
    check('firstName', 'First name is required').notEmpty(),
    check('lastName', 'Last name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: errors.array() });
    }
    next();
}, registerUser);

router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: errors.array() });
    }
    next();
}, loginUser);

router.post('/reset-password', [
    check('email', 'Please include a valid email').isEmail(),
    check('newPassword', 'New password must be 6 or more characters').isLength({ min: 6 }),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, message: errors.array() });
    }
    next();
}, resetPassword);

module.exports = router;
