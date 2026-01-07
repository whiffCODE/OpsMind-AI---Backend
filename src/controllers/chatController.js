const { askOpsMind } = require('../services/ragChatService');

const ChatHistory = require('../models/ChatHistory');

const askQuestion = async (req, res) => {

    try {

        const userQuery = req.body.query;
        const userId = req.user.id;

        const result = await askOpsMind(userQuery);

        const history = new ChatHistory({
            userId,
            query: userQuery,
            response: result.response,
            sources: result.sources
        });

        await history.save();

        res.json({
            answer: result.response,
            sources: result.sources
        });

    } catch(err) {
        res.status(500).json({ msg: err.message });
    }
};

module.exports = {
    askQuestion
};
