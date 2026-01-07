const axios = require('axios');
const { retrieveRelevantChunks } = require('./ragService');

const askOpsMind = async (userQuery) => {

    const chunks = await retrieveRelevantChunks(userQuery);

    if (!chunks.length) {
        return {
            response: "I don't know based on the current SOP knowledge base.",
            sources: []
        };
    }

    const contextText = chunks.map(c => `Page ${c.pageNumber}: ${c.text}`).join("\n\n");

    const prompt = `
You are OpsMind AI. Answer only from the provided SOP context.
If the answer is not present, say exactly: I don't know.

Context:
${contextText}

Question: ${userQuery}
`;

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    const llmResponse = await axios.post(`${url}?key=YOUR_API_KEY`, {
        contents: [{ parts: [{ text: prompt }] }]
    });

    return {
        response: llmResponse.data.candidates[0].content.parts[0].text,
        sources: chunks.map(c => c.fileName)
    };
};

module.exports = { askOpsMind };
