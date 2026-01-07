const { GoogleGenerativeAI } = require("@google/generative-ai");
const { retrieveTopChunks } = require("./retrievalService");
const { buildContext } = require("./contextService");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const streamOpsMind = async (question, onChunk) => {
    const chunks = await retrieveTopChunks(question, 5);
    const context = buildContext(chunks, 0.55);

    if (!context) {
        onChunk("I don't know based on the current SOP knowledge base.");
        return {
            finalAnswer: "I don't know based on the current SOP knowledge base.",
            sources: []
        };
    }

    const prompt = `
You are OpsMind AI, an enterprise SOP assistant.

RULES:
- Answer ONLY from the provided SOP context.
- If the answer is not present, say exactly:
  "I don't know based on the current SOP knowledge base."

SOP Context:
${context.contextText}

Question:
${question}
`;

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });

    const stream = await model.generateContentStream(prompt);

    let fullAnswer = "";

    for await (const chunk of stream.stream) {
        const text = chunk.text();
        if (text) {
            fullAnswer += text;
            onChunk(text);
        }
    }

    return {
        finalAnswer: fullAnswer,
        sources: context.sources
    };
};

module.exports = { streamOpsMind };
