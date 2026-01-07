require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGO_URI,
    geminiKey: process.env.GEMINI_API_KEY
};
