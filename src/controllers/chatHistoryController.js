const ChatHistory = require("../models/ChatHistory");

exports.getMyChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await ChatHistory.find({ userId })
      .sort({ askedAt: -1 })
      .limit(50); // safe default

    res.json(history);
  } catch (err) {
    console.error("CHAT HISTORY ERROR:", err.message);
    res.status(500).json({ msg: "Failed to load chat history" });
  }
};
