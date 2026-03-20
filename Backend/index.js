const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/db/db');


dotenv.config();

const PORT = process.env.PORT;
const app = express();


//database connnection
connectDB();


app.listen(PORT, () => {
    console.log("Server is running on Port 3000")
})