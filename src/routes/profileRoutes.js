const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { getProfile } = require("../controllers/profileController");

router.get("/", verifyToken, getProfile);

module.exports = router;
