const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const roleCheck = require('../middleware/roleMiddleware');

const adminController = require('../controllers/adminController');

router.post(
    '/upload',
    verifyToken,
    roleCheck('admin'),
    adminController.upload.single('file'),
    adminController.uploadSOP
);

module.exports = router;
