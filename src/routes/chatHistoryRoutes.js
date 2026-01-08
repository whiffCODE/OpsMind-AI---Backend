const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const { getMyChatHistory } = require("../controllers/chatHistoryController");

router.get("/me", verifyToken, getMyChatHistory);

module.exports = router;
