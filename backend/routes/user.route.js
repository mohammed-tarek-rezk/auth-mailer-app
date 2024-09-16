const express = require('express');
const { signup, login, verifyEmail, logout , forgetPassword , resetPassword, checkUser} = require('../controllers/user.controller');
const { signupMiddleware, LoginMiddleware } = require('../middlewares/user.middleware');
const verifyToken = require('../middlewares/verifyToken');
const userRoute = express.Router()

userRoute.post("/signup", signupMiddleware ,signup)
userRoute.post("/verify-email", verifyToken ,verifyEmail)
userRoute.post("/login",LoginMiddleware, login)
userRoute.post("/logout", logout)
userRoute.post("/forget-password", forgetPassword)
userRoute.post("/reset-password/:token", resetPassword)
userRoute.get("/check", verifyToken ,checkUser)



module.exports = userRoute