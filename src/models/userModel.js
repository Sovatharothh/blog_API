const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const shortid = require('shortid');

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: Image,
        required: true,
    },
}, {
    timestamps: true,
});

// Use function keyword for pre-save hook to correctly bind 'this'
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    try {
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
        next();
    } catch (error) {
        return next(error);
    }
});

// Method to validate password
userSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
