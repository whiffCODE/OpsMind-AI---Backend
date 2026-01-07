const mongoose = require('mongoose');
const { mongoURI } = require('./env');

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("MongoDB Connected 📦");
    } catch (err) {
        console.error("DB Connection Error:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
