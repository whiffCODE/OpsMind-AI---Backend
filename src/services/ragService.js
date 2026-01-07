const SOPChunk = require('../models/SOPChunk');
const { generateEmbedding } = require('./embeddingService');

const retrieveRelevantChunks = async (query) => {

    const queryEmbedding = await generateEmbedding(query);

    const allChunks = await SOPChunk.find();

    let scored = allChunks.map(c => {
        const dot = c.embedding.reduce((sum,val,i) => sum + val * queryEmbedding[i], 0);
        return { chunk: c, score: dot };
    });

    scored.sort((a,b) => b.score - a.score);

    return scored.slice(0,5).map(s => s.chunk);
};

module.exports = { retrieveRelevantChunks };
