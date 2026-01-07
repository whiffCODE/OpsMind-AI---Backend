const mongoose = require('mongoose');

const ChatHistorySchema = new mongoose.Schema({
    userId: String,
    query: String,
    response: String,
    sources: [String],
    askedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatHistory', ChatHistorySchema);
