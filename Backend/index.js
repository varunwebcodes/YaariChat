const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/db/db');
const authRoute = require('./src/routes/authRoute')


dotenv.config();

const PORT = process.env.PORT;
const app = express();

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
//database connnection
connectDB();


//Routes
app.use('/api/auth', authRoute)


app.listen(PORT, () => {
    console.log("Server is running on Port 3000")
})