const mongoose = require('mongoose');

const SOPDocumentSchema = new mongoose.Schema({
    docId: String,
    fileName: String,
    totalPages: Number,
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SOPDocument', SOPDocumentSchema);
