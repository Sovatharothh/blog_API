const asyncHandler = require('express-async-handler');
const userService = require('../services/userService');


// register new user
const registerUser = asyncHandler(async(req, res)=>{
    const {firstName, lastName, email, password, profileImage} = req.body;

    try{
        const user = await userService.registerUser(firstName, lastName, email, password, profileImage);
        res.status(201).json({user});
    }catch(error){
        res.status(400).json({message: error.message});
    }
});

// user login
const userLogin = asyncHandler(async(req, res)=>{
    const { email, password} = req.body;

    try{
        const { user, token } = await userService.userLogin(email, password);
        res.status(200).json({user, token});

    }catch(error){
        res.status(400).json({message: error.message});

    }
});

// reset password
const resetPassword = asyncHandler(async(req, res)=>{
    const { email, newPassword } = req.body;

    try{
        const { email, newPassword } = await userService.resetPassword(email, newPassword);
        res.status(200).json(result);

    }catch(error){
        res.status(400).json({message: error.message});

    }
});

module.exports = {
    registerUser,
    userLogin,
    registerUser,
};