const mongoose = require('mongoose');

const SOPChunkSchema = new mongoose.Schema({
    chunkId: String,
    docId: String,
    text: String,
    pageNumber: Number,
    embedding: [Number]
});

module.exports = mongoose.model('SOPChunk', SOPChunkSchema);
