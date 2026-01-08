function calculateConfidence(chunks) {
  if (!chunks || chunks.length === 0) return 0.2;

  const avg =
    chunks.reduce((s, c) => s + c.score, 0) / chunks.length;

  return Math.min(0.95, Math.max(0.3, avg));
}

module.exports = { calculateConfidence };
