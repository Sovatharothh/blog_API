const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const dotenv = require('dotenv');
const User = require('../models/userModel');
dotenv.config();

// register new user
const registerUser = async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: error.array()});
    }

    const {firstName, lastName, email, password, profileImage} = req.body;
    try {
        let existingUser = await User.findOne({email});
        if (existingUser){
            return res.status(400).json({status: 400, message: 'User alr exits with this email'});
        }

        // hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashPassword,
            profileImage,
        });

        // save user to db

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ user: newUser, token });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ status: 500, message: 'Server error' });
    }
};

// user login
const userLogin = async (req, res)=>{
    const { email, password } = req.body;
    try{
        // check if user exist
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({status: 404, message: 'User not found TT'});
        }

        // check if the password is valid
        const isValidPassword = await user.isValidPassword(password);
        if(!isValidPassword){
            return res.status(404).json({status: 404, message: 'Invalid password TT'});
        }

        // generate jwt token
        const token = jwt.sign(
            {userId: user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );
        res.status(200).json({user, token});
        
    }catch(error){
        console.error('Error logging in user', error);
        res.status(500).json({status: 500, message: 'Sever error'});

    }
};


// reset password
const resetPassword = async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const { email, newPassword } = req.body;
    try{
        // find user by email
        let user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message: 'User not found TT'});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // update new password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({message: 'Password reset successfully'});

    }catch(error){
        console.error('Error resetting new password', error);
        res.status(500).json({message: 'Server error'});


    }
};

module.exports = {
    registerUser,
    userLogin,
    resetPassword,
};