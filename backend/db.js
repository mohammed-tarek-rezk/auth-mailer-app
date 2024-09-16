const mongoose = require('mongoose')


mongoose.connect(process.env.DB_URL).then(_=> {
    console.log('Connected to MongoDB successfully')
})