const express = require("express");
const cookieParser = require('cookie-parser')
const { default: mongoose } = require("mongoose");
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const plantRouter = require('./routes/plantRoutes')
const { apiLimiter } = require('./middlewares/rateLimiter')
const globalErrorHandler = require('./controllers/errorController')
require('dotenv').config();

const app = express();
app.use(express.json()); //for parsing the req.body
app.use(cookieParser())
app.use(globalErrorHandler)

// Rate limiting middleware
app.use('/api', apiLimiter);

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/plant',plantRouter)
app.get('/', (req, res) => {
    res.send('GreenGuru API is running..')
})

app.use(globalErrorHandler);


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


