const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail , "Please enter a valid email"]
    },
    lastLogin:{
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken:{
        type: String
    },
    verificationTokenExpiresAt: Date,
    resetToken:{
        type: String
    },
    resetTokenExpiresAt: Date
}, {timestamps: true})


module.exports = mongoose.model('User', userSchema)