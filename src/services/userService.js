const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
const User = require('../models/userModel');

dotenv.config();

// generate access token
const generateAccessToken = (user) =>{
    return jwt.sign(
        { userId: user._id, email: user.email},
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
};

// generate refresh token
const generateRefreshToken = (user)=>{
    return jwt.sign(
        { userId: user._id, emial: user.email},
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d'}
    )
}

// Register new user
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, profileImage } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).json({ status: 400, message: 'User already exists with this email TT' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        profileImage,
    });

    // Save user to database
    await newUser.save();

    // Generate JWT token
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    return { user: newUser, accessToken, refreshToken };

});

// User login
const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ status: 404, message: 'User not found' });
    }

    // Check if the password is valid
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        return res.status(401).json({ status: 401, message: 'Invalid password' });
    }

    // Generate JWT token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { user, accessToken, refreshToken };

});


// Reset password
const resetPassword = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, errors: errors.array() });
    }

    const { email, newPassword } = req.body;

    try {
        // Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ status: 200, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({status: 500,  message: 'Server error' });
    }
});

// refresh token
const refreshToken = asyncHandler(async(req, res)=>{
    if(!token){
        return res.status(404).json({status: 404, message: 'No token provided...'});
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user){
        return res.status(404).json({status: 404, message: 'Invalid token'});

    }

    const accessToken = generateAccessToken(user);
    return {accessToken};
})

module.exports = {
    registerUser,
    userLogin,
    resetPassword,
    refreshToken,
};
