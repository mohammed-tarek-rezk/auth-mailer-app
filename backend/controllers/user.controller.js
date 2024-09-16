const validator = require('validator')
const User = require('../models/user.model')
const AppError = require('../utils/AppError')
const statusText = require('../utils/statusText')
const bcrypt = require("bcrypt")
const {sendingEmails , sendingWelcomeEmail, sendingResetPasswordEmail, sendingConfirmResetPassword} = require('../utils/email.config')
const generateTokenAndCookies = require('../utils/generateTokenAndCookies')
const crypto = require('crypto')
const signup = async(req , res ,next)=>{
    const { name, email, password } = req.body

    //validate is email exists 
    let verifyExists = await User.findOne({ email: email })
    if (verifyExists) return next(AppError.create(statusText.FAIL , 400 , "User is already Exists"))

    //save user
    let hashPassword = await bcrypt.hash(password , 10)
    let newUser = new User({
        name: name,
        email: email,
        password: hashPassword
    })
    let verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
    let verificationTokenExpiresAt = Date.now() + 1000 * 60 * 60 * 24
    newUser.verificationToken = verificationToken;
    newUser.verificationTokenExpiresAt = verificationTokenExpiresAt
    await sendingEmails(email , verificationToken)
    await newUser.save()

    generateTokenAndCookies(res, {id: newUser._id , email: newUser.email})

    res.status(201).json({status: statusText.SUCCESS , message: "user created successfully" , data: {...newUser._doc , password: undefined}})
}
const verifyEmail = async(req , res ,next)=>{
    const { code } = req.body;
    if (!code) return next(AppError.create(statusText.FAIL , 400 , "code is required"))
    let user = await User.findOne({verificationToken: code , verificationTokenExpiresAt: {$gt: Date.now()}})
    if (!user) return next(AppError.create(statusText.FAIL , 400 , "Invalid or expired verification code"))
    user.isVerified = true;
    user.verificationToken= undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save()
    await sendingWelcomeEmail(user.email , user.name)
    res.json({status: statusText.SUCCESS , message: "Email verified successfully", data:{ ...user._doc , password:undefined}})
}
const login = async(req , res ,next)=>{
    const {email , password}= req.body;
    let user = await User.findOne({email})
    if (!user ||!bcrypt.compareSync(password, user.password)) return next(AppError.create(statusText.FAIL , 401 , "Invalid email or password"))
    user.lastLoginAt = Date.now();
    generateTokenAndCookies(res, {id: user._id , email: user.email})
    await user.save()
    res.json({status: statusText.SUCCESS , message: "Login successfully", data: {...user._doc , password: undefined}})
}
const logout = async(req , res ,next)=>{
    res.clearCookie("token")
    res.json({status: statusText.SUCCESS , message: "Logout successfully"})
}


const forgetPassword = async(req , res , next)=>{
    const {email}  = req.body
    if(!email || !validator.isEmail(email)) return next(AppError.create(statusText.FAIL , 400 , "Please Enter valid Email"))
    let user = await User.findOne({email})
    if(!user) return next(AppError.create(statusText.FAIL , 404 , "User Not Found"))
    let resetToken = crypto.randomBytes(30).toString("hex")
    let resetTokenExpiresAt = Date.now() + 1000 * 60 * 60
    user.resetToken = resetToken;
    user.resetTokenExpiresAt = resetTokenExpiresAt;
    sendingResetPasswordEmail(user.email , user.name , `${process.env.FRONTEND_URL}/reset-password/${resetToken}`)
    await user.save()
    res.json({status: statusText.SUCCESS , message: "Reset Password Link sent successfully"})
}
const resetPassword = async (req , res , next)=>{
    const {token} = req.params
    const {password} = req.body
    if(!password || !validator.isStrongPassword(password)) return next(AppError.create(statusText.FAIL , 400 , "Please enter valid strong password"))
    const user = await User.findOne({resetToken: token , resetTokenExpiresAt: {$gt: Date.now()}})
    if(!user) return next(AppError.create(statusText.FAIL , 404 , "User Not Found or Reset Token Expired"))
    if(await bcrypt.compare(password , user.password)) return next(AppError.create(statusText.FAIL , 400 , "password should not match the previous one"))
    let hashPassword = await bcrypt.hash(password , 10)
    user.password = hashPassword;
    user.resetToken = undefined;
    user.resetTokenExpiresAt = undefined;
    await sendingConfirmResetPassword(user.email)
    await user.save();
    res.json({status: statusText.SUCCESS , message: "Password Reset Successfully"})
}

const checkUser = async (req , res ,next)=>{
    user = req.user
    let loginUser = await User.findById(user.id).select("-password")
    if(!loginUser) return next(AppError.create(statusText.FAIL , 404 , "User Not Found"))
    res.send({status: statusText.SUCCESS , message:"Authentication success" , data: loginUser})
}

module.exports = { signup , verifyEmail , login , logout,forgetPassword, resetPassword , checkUser}