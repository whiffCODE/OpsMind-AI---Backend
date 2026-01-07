const SOPChunk = require('../models/SOPChunk');
const { generateEmbedding } = require('./embeddingService');

const retrieveTopChunks = async (query, limit = 5) => {

    // 1️⃣ Embed user query
    const queryEmbedding = await generateEmbedding(query);

    // 2️⃣ Atlas Vector Search
    const results = await SOPChunk.aggregate([
        {
            $vectorSearch: {
                index: "sopvectorindex", // name of Atlas search index
                path: "embedding",
                queryVector: queryEmbedding,
                numCandidates: 100,
                limit: limit
            }
        },
        {
            $project: {
                _id: 0,
                chunkId: 1,
                docId: 1,
                text: 1,
                pageNumber: 1,
                score: { $meta: "vectorSearchScore" }
            }
        }
    ]);

    return results;
};

module.exports = { retrieveTopChunks };
