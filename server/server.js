const express = require("express");
const cookieParser = require('cookie-parser')
const { default: mongoose } = require("mongoose");
const app = express();
require('dotenv').config()
app.use(express.json()); //for parsing the req.body
app.use(cookieParser())
app.get('/', (req, res) => {
    res.send('Hello from backend!')
})

 
const server = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONN_STR)
        console.log(" MongoDB Connected successfully")
        app.listen(process.env.PORT, () => {
            console.log(`Server is running at http://localhost:${process.env.PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}
server();


