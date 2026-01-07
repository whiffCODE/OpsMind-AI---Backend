const { v4: uuidv4 } = require('uuid');

const chunkText = (text) => {
    const size = 1000;
    const overlap = 100;

    let chunks = [];
    let start = 0;

    while (start < text.length) {
        const end = start + size;
        const chunk = text.slice(start,end);

        chunks.push({
            chunkId: uuidv4(),
            text: chunk
        });

        start = end - overlap;
    }

    return chunks;
};

module.exports = { chunkText };
