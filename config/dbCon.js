const mongoose = require("mongoose");

const connectDB = async () => {
    mongoose.set('strictQuery', true) //suppres MongoDB warnigs
    try {
        await mongoose.connect(
            process.env.DATABASE_URI, //connection string
            {//prevent warnings
                useUnifiedTopology: true,
                useNewUrlParser: true
            }
        )
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB;