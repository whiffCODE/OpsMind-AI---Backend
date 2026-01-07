const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { askQuestion } = require("../controllers/chatController");
const { streamChat } = require("../controllers/chatStreamController");

// Normal (non-stream)
router.post("/ask", verifyToken, askQuestion);

// Streaming (SSE)
router.post("/stream", verifyToken, streamChat);

module.exports = router;
