const ChatHistory = require("../models/ChatHistory");
const { streamOpsMind } = require("../services/ragChatService");
const { setupSSE, sendEvent, closeSSE } = require("../utils/sseUtil");

const streamChat = async (req, res) => {
  try {
    setupSSE(res);

    if (!req.user) {
      sendEvent(res, { error: "Unauthorized" });
      return closeSSE(res);
    }

    const { query } = req.body;
    const userId = req.user.id;

    if (!query) {
      sendEvent(res, { error: "Query is required" });
      return closeSSE(res);
    }

    let collectedAnswer = "";
    let finalSources = [];

    /**
     * streamOpsMind should:
     * - stream chunks via callback
     * - return { sources }
     */
    const result = await streamOpsMind(query, (chunk) => {
      collectedAnswer += chunk;
      sendEvent(res, {
        type: "chunk",
        text: chunk
      });
    });

    finalSources = result?.sources || [];

    // Persist chat after streaming completes
    await ChatHistory.create({
      userId,
      query,
      response: collectedAnswer,
      sources: finalSources
    });

    // Send sources as final event
    sendEvent(res, {
      type: "sources",
      sources: finalSources
    });

    closeSSE(res);

  } catch (err) {
    console.error("STREAMING ERROR 🔥", err);
    sendEvent(res, { error: err.message || "Streaming failed" });
    closeSSE(res);
  }
};

module.exports = { streamChat };
