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
            throw new Error('User already exists with this email');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstName, lastName, email, password: hashedPassword, profileImage });
        await newUser.save();

        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        return { user: newUser, accessToken, refreshToken };
    } catch (error) {
        throw new Error(error.message); 
    }
};

// user login
const userLogin = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid password');
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return { user, accessToken, refreshToken };
    } catch (error) {
        throw new Error(error.message); 
    }
};

// reset new password
const resetPassword = async (email, newPassword) => {
    try {
        let user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return { status: 200, message: 'Password reset successfully' };
    } catch (error) {
        throw new Error(error.message); 
    }
};

// refresh token
const refreshToken = async (token) => {
    try {
        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            throw new Error('Invalid token');
        }

        const accessToken = generateAccessToken(user);
        return { accessToken };
    } catch (error) {
        throw new Error(error.message); 
    }
};

module.exports = {
    registerUser,
    userLogin,
    resetPassword,
    refreshToken,
};
