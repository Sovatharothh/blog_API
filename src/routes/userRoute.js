const express = require('express');
const { check, body } = require('express-validator');
const { registerUser, loginUser, resetPassword } = require('../controllers/userController');

const router = express.Router();

// register new user
router.post('/register', [
    check('firstName', 'FirstName is required').notEmpty(),
    check('lastName', 'LastName is required').notEmpty(),
    check('email', 'Please include a valid email').notEmail(),
    check('password', 'Password must be at least 6 long').isLength({min: 6}),

], registerUser);

// user login
router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
], loginUser);

// reset password
router.post('reset', [
    check('email', 'Please inculde a valid email').isEmail(),
    check('new password', 'New password must be at least 6 num/character long').isLength({min: 6}),
], resetPassword);

module.exports = router;