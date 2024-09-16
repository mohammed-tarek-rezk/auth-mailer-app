const jwt = require("jsonwebtoken");

const generateTokenAndCookies = (res , payload)=>{
    const token = jwt.sign(payload , process.env.JWT_SECRET ,{
        expiresIn: '7d'
    })
    res.cookie("token" , token , {
        httpOnly: true ,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7 * 1000 
    })

    return token;
}


module.exports = generateTokenAndCookies;