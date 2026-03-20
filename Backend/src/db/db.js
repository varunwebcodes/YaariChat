const mongoose = require('mongoose');

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Database Connected Successfully")
    }catch (error) {
        console.error("error connecting database", error.message)
        process.exit(1);
    }
}

module.exports = connectDB