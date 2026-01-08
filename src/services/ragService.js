const SOPChunk = require("../models/SOPChunk");
const { generateEmbedding } = require("./embeddingService");

/**
 * Cosine similarity between two vectors
 */
function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Retrieve top relevant SOP chunks for a query
 */
const retrieveRelevantChunks = async (query, topK = 5) => {
  // 1️⃣ Embed the query
  const queryEmbedding = await generateEmbedding(query);

  // 2️⃣ Fetch chunks (later → replace with vector DB)
  const allChunks = await SOPChunk.find(
    {},
    { text: 1, embedding: 1, docId: 1, pageNumber: 1 }
  );

  // 3️⃣ Score chunks
  const scoredChunks = allChunks.map(chunk => {
    const score = cosineSimilarity(chunk.embedding, queryEmbedding);
    return {
      chunk,
      score
    };
  });

  // 4️⃣ Sort by relevance
  scoredChunks.sort((a, b) => b.score - a.score);

  // 5️⃣ Return top K with scores
  return scoredChunks.slice(0, topK);
};

module.exports = { retrieveRelevantChunks };
