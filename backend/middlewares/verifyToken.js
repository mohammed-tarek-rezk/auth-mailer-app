const Jwt  =require("jsonwebtoken");
const AppError = require("../utils/AppError");
const statusText = require("../utils/statusText");


const verifyToken = async (req , res , next)=>{
    let token = req.cookies.token
    if(!token) return next(AppError.create(statusText.ERROR , 401 , "Not authorized"))

    const decoded  = Jwt.verify(token , process.env.JWT_SECRET)
    if(!decoded) return next(AppError.create(statusText.ERROR , 401 , "Not authorized"))
    req.user = decoded
    next()
}

module.exports = verifyToken;