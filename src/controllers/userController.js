const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const userService = require('../services/userService');

dotenv.config();

// register new user
const registerUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, profileImage } = req.body;

    try {
        const user = await userService.registerUser({ firstName, lastName, email, password, profileImage });
        res.status(201).json({ user });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ status: 400, message: error.message });
        }
        console.log(error);
        res.status(500).json({ status: 500, message: 'Server error' });
    }
});

// user login
const userLogin = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const { user, accessToken, refreshToken } = await userService.userLogin(email, password);
        res.status(200).json({ user, accessToken, refreshToken });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// reset new password
const resetPassword = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, newPassword } = req.body;

    try {
        const result = await userService.resetPassword(email, newPassword);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// refresh token
const refreshAccessToken = asyncHandler(async (req, res) => {
    const token = req.headers.authorization;

    try {
        const { accessToken } = await userService.refreshToken(token);
        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = {
    registerUser,
    userLogin,
    resetPassword,
    refreshAccessToken,
};
