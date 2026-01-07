const SOPChunk = require("../models/SOPChunk");

exports.getSnippet = async (req, res) => {
  const { docId, page } = req.query;

  const chunk = await SOPChunk.findOne({ docId, pageNumber: page });

  if (!chunk) {
    return res.status(404).json({ msg: "Snippet not found" });
  }

  res.json({
    text: chunk.text.slice(0, 600) + "..."
  });
};