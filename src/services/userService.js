const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// generate access token
const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user._id, email: user.email},
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// generate refresh token
const generateRefreshToken = (user) => {
    return jwt.sign(
        { userId: user._id, email: user.email},
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d'}
    );
};

// register new user
const registerUser = async ({ firstName, lastName, email, password, profileImage }) => {
    try {
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return { status: 409, message: 'User already exists with this email' };
        }

        const newUser = new User({ firstName, lastName, email, password, profileImage });
        await newUser.save();

        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        return { status: 201, message: 'User registered successfully', user: newUser, accessToken, refreshToken };
    } catch (error) {
        console.log(error);
        return { status: 500, message: error.message };
    }
};

// user login
const userLogin = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return { status: 404, message: 'User not found' };
        }

        const isValidPassword = await user.isValidPassword(password);
        if (!isValidPassword) {
            return { status: 401, message: 'Invalid password' };
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return { status: 200, message: 'Login successful', user, accessToken, refreshToken };
    } catch (error) {
        return { status: 500, message: error.message };
    }
};

// reset new password
const resetPassword = async (email, newPassword) => {
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return { status: 404, message: 'User not found' };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return { status: 200, message: 'Password reset successfully' };
    } catch (error) {
        return { status: 500, message: error.message };
    }
};

// refresh token
const refreshToken = async (token) => {
    try {
        if (!token) {
            return { status: 400, message: 'No token provided' };
        }

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return { status: 401, message: 'Invalid token' };
        }

        const accessToken = generateAccessToken(user);
        return { status: 200, accessToken };
    } catch (error) {
        return { status: 500, message: error.message };
    }
};

module.exports = {
    registerUser,
    userLogin,
    resetPassword,
    refreshToken,
};
