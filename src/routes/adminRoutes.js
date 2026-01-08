const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const roleCheck = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

// Upload SOP
router.post(
    '/upload',
    verifyToken,
    roleCheck('admin'),
    adminController.upload.single('file'),
    adminController.uploadSOP
);

// List SOPs
router.get(
    '/sops',
    verifyToken,
    roleCheck('admin'),
    adminController.getSOPs
);

// Reindex SOP
router.post(
    '/reindex/:docId',
    verifyToken,
    roleCheck('admin'),
    adminController.reindexSOP
);

// Delete SOP
router.delete(
    '/sop/:docId',
    verifyToken,
    roleCheck('admin'),
    adminController.deleteSOP
);

module.exports = router;
