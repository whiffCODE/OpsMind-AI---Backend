const { askOpsMind } = require('../services/ragChatService');
const ChatHistory = require('../models/ChatHistory');

const askQuestion = async (req, res) => {
    try {
        const { query } = req.body;
        const userId = req.user.id;

        if (!query) {
            return res.status(400).json({ msg: "Query is required" });
        }

        const result = await askOpsMind(query);

        // Persist chat history (users only see THEIR history)
        await ChatHistory.create({
            userId,
            query,
            response: result.answer,
            sources: result.sources
        });

        res.json({
            answer: result.answer,
            sources: result.sources
        });

    } catch (err) {
        console.error("Chat Error:", err.message);
        res.status(500).json({ msg: "Chat failed" });
    }
};

module.exports = {
    askQuestion
};
