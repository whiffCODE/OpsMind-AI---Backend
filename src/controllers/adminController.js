const multer = require('multer');
const fs = require('fs');
const { parsePDF } = require('../services/pdfService');
const { chunkText } = require('../services/chunkService');
const { generateEmbedding } = require('../services/embeddingService');
const SOPChunk = require('../models/SOPChunk');
const SOPDocument = require('../models/SOPDocument');
const { v4: uuidv4 } = require('uuid');

// CREATE MULTER INSTANCE INSIDE CONTROLLER
const storage = multer.diskStorage({
    destination: function(req, file, cb) {

        // ensure folder exists
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }

        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// EXPORT THIS INSTANCE
exports.upload = upload;


// CONTROLLER HANDLER
exports.uploadSOP = async (req, res) => {

    try {

        console.log("Controller received file:", req.file);

        if (!req.file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }

        const filePath = req.file.path;

        console.log("About to call parsePDF:", parsePDF);

        // VERIFY parsePDF ACTUALLY EXISTS
        if (typeof parsePDF !== 'function') {
            console.log("parsePDF type:", typeof parsePDF);
            throw new Error("parsePDF is not a function");
        }

        const parsed = await parsePDF(filePath);

        const docId = uuidv4();

        const sopDoc = new SOPDocument({
            docId,
            fileName: req.file.originalname,
            totalPages: parsed.totalPages
        });

        await sopDoc.save();

        const chunks = chunkText(parsed.text);

        for (let c of chunks) {

            const embedding = await generateEmbedding(c.text);

            const chunkRecord = new SOPChunk({
                chunkId: c.chunkId,
                docId,
                text: c.text,
                pageNumber: 1,
                embedding
            });

            await chunkRecord.save();
        }

        res.json({ msg: "SOP uploaded and indexed successfully 📘" });

    } catch(err) {

        console.error("Upload Error:", err.message);

        res.status(500).json({ msg: "Upload failed" });

    }

};


// FINAL EXPORT OBJECT (COMMONJS SAFE)
module.exports = {
    upload: upload,
    uploadSOP: exports.uploadSOP
};
