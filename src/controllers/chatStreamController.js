const ChatHistory = require("../models/ChatHistory");
const { streamOpsMind } = require("../services/ragChatService");
const { setupSSE, sendEvent, closeSSE } = require("../utils/sseUtil");

const streamChat = async (req, res) => {
    try {
        setupSSE(res);

        const { query } = req.body;
        const userId = req.user.id;

        if (!query) {
            sendEvent(res, { error: "Query is required" });
            return closeSSE(res);
        }

        let collectedAnswer = "";

        const result = await streamOpsMind(query, (chunk) => {
            collectedAnswer += chunk;
            sendEvent(res, { type: "chunk", text: chunk });
        });

        // Save chat after stream completes
        await ChatHistory.create({
            userId,
            query,
            response: collectedAnswer,
            sources: result.sources
        });

        sendEvent(res, {
            type: "sources",
            sources: result.sources
        });

        closeSSE(res);

    } catch (err) {
        console.error("Streaming Error:", err.message);
        sendEvent(res, { error: "Streaming failed" });
        closeSSE(res);
    }
};

module.exports = { streamChat };
