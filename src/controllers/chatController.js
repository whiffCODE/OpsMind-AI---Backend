const { askOpsMind } = require("../services/ragChatService");
const ChatHistory = require("../models/ChatHistory");

const askQuestion = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ msg: "Query is required" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const userId = req.user.id;

    // 🔹 Call RAG service
    const result = await askOpsMind(query);

    /**
     * Expected shape from askOpsMind:
     * {
     *   answer: string,
     *   sources: array
     * }
     */

    const answer = result?.answer || "I don't know based on the current SOP knowledge base.";
    const sources = Array.isArray(result?.sources) ? result.sources : [];

    // 🔹 Persist chat history
    await ChatHistory.create({
      userId,
      query,
      response: answer,
      sources,
    });

    // 🔹 Send response to client
    return res.json({
      answer,
      sources,
    });

  } catch (err) {
    console.error("CHAT ERROR 🔥", err);

    return res.status(500).json({
      msg: "Chat failed",
      error: err.message,
    });
  }
};

module.exports = { askQuestion };
