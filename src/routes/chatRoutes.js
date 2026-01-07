const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');

const chatController = require('../controllers/chatController');

router.post('/ask', verifyToken, chatController.askQuestion);

module.exports = router;
