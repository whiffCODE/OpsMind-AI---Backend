function formatAnswer(text) {
  if (!text) return text;

  const clean = text
    .replace(/\*/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const lines = clean.split("\n").filter(Boolean);

  const procedural =
    lines.length >= 3 &&
    lines.every(l => l.length < 140);

  if (procedural) {
    return lines.map((l, i) => `${i + 1}. ${l}`).join("\n\n");
  }

  return clean;
}

module.exports = { formatAnswer };
