const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { getSnippet } = require("../controllers/sourceController");

router.get("/snippet", verifyToken, getSnippet);

module.exports = router;