const Joi = require('joi');
const AppError = require('../utils/AppError');
const statusText = require('../utils/statusText');
const validator = require("validator")

const signupMiddleware= (req , res , next)=>{
        let schema = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required()
        }) 

        let {error} = schema.validate(req.body)
        if(error) return next(AppError.create(statusText.FAIL , 400 , "InValid data" , error.details))
        if(!validator.isStrongPassword(req.body.password)) return next(AppError.create(statusText.FAIL , 400 , "Enter Strong Password" , "Please Enter strong password"))
        next()
} 
const LoginMiddleware= (req , res , next)=>{
        let schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required()
        }) 
        let {error} = schema.validate(req.body)
        if(error) return next(AppError.create(statusText.FAIL , 400 , "InValid data" , error.details))
        if(!validator.isStrongPassword(req.body.password)) return next(AppError.create(statusText.FAIL , 400 , "Enter strong password" , "Please Enter strong password"))
        next()
} 

module.exports = {signupMiddleware ,LoginMiddleware}





