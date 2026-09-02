const express = require("express");
const cookieParser = require('cookie-parser')
const { default: mongoose } = require("mongoose");
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
require('dotenv').config();

const app = express();

app.use(express.json()); //for parsing the req.body
app.use(cookieParser())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.get('/', (req, res) => {
    res.send('GreenGuru API is running..')
})


const server = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONN_STR)
        console.log(" MongoDB Connected successfully")
        app.listen(process.env.PORT, () => {
            console.log(`Server is running at http://localhost:${process.env.PORT}`)
        })
    } catch (error) {
        //console.log(error)
    }
}
server();


