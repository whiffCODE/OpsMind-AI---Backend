const { GoogleGenerativeAI } = require("@google/generative-ai");
const { retrieveTopChunks } = require("./retrievalService");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const FALLBACK =
  "I don't know based on the current SOP knowledge base.";

/**
 * Build a clean context block for Gemini
 */
function buildContext(chunks) {
  return chunks
    .map(
      (c, i) =>
        `Source ${i + 1}:
${c.text.replace(/\s+/g, " ").trim()}`
    )
    .join("\n\n");
}

async function askOpsMind(question) {
  const chunks = await retrieveTopChunks(question, 5);

  if (!chunks.length) {
    return {
      answer: FALLBACK,
      sources: [],
      confidence: 0,
    };
  }

  const context = buildContext(chunks);

  const prompt = `
You are OpsMind AI, an enterprise SOP assistant.

STRICT RULES:
- Answer ONLY from the SOP context below
- Structure the response in clear paragraphs or numbered points
- Do NOT use markdown symbols (*, -, ###)
- Do NOT hallucinate or add external knowledge
- If the answer is not clearly present, say exactly:
"${FALLBACK}"

SOP Context:
${context}

User Question:
${question}
`;

  let answer = FALLBACK;

  try {
    const model = genAI.getGenerativeModel({
      // ⚠️ Use a model that works with generateContent
      model: "models/gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);
    answer = result.response.text().trim();
  } catch (err) {
    console.error("❌ Gemini generation failed:", err.message);
  }

  // Confidence heuristic (simple + explainable)
  const confidence = Math.min(1, chunks.length / 5);

  return {
    answer,
    sources: chunks.map(
      (c) => `${c.docId} • Page ${c.pageNumber || 1}`
    ),
    confidence: Number(confidence.toFixed(2)),
  };
}

module.exports = { askOpsMind };
