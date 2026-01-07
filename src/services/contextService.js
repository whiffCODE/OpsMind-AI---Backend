const buildContext = (chunks, minScore = 0.75) => {

    // Filter weak matches
    const strongChunks = chunks.filter(c => c.score >= minScore);

    if (strongChunks.length === 0) {
        return null;
    }

    const contextText = strongChunks
        .map(c =>
            `Source: Document ${c.docId}, Page ${c.pageNumber}\n${c.text}`
        )
        .join("\n\n");

    return {
        contextText,
        sources: strongChunks.map(c =>
            `Document ${c.docId}, Page ${c.pageNumber}`
        )
    };
};

module.exports = { buildContext };
