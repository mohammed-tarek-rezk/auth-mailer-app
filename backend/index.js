const express = require('express')
require("express-async-errors")
require("dotenv").config()
require("./db")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const statusText = require('./utils/statusText')
const AppError = require('./utils/AppError')
const userRoute = require('./routes/user.route')
const app = express()
const port =  process.env.PORT || 5500


app.use(cors({origin:"http://localhost:5173" , credentials: true}))
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser())
app.use("/api/users", userRoute)

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}


app.use((error , req , res , next)=>{
    
    res.status(error.statusCode || 500).json({
        status: error.status || statusText.ERROR,
        message: error.message || "Something went wrong", 
        data: error.data || null
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))