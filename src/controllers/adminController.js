const multer = require('multer');
const fs = require('fs');
const { parsePDF } = require('../services/pdfService');
const { chunkText } = require('../services/chunkService');
const { generateEmbedding } = require('../services/embeddingService');
const SOPChunk = require('../models/SOPChunk');
const SOPDocument = require('../models/SOPDocument');
const { v4: uuidv4 } = require('uuid');

/* ================================
   Multer Setup
================================ */

const storage = multer.diskStorage({
    destination(req, file, cb) {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, uuidv4() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

/* ================================
   Controllers
================================ */

/**
 * POST /api/admin/upload
 */
const uploadSOP = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }

        const parsed = await parsePDF(req.file.path);
        const docId = uuidv4();

        const sopDoc = new SOPDocument({
            docId,
            fileName: req.file.originalname,
            totalPages: parsed.totalPages
        });
        await sopDoc.save();

        const chunks = chunkText(parsed.text);

        for (const c of chunks) {
            const embedding = await generateEmbedding(c.text);

            await SOPChunk.create({
                chunkId: c.chunkId,
                docId,
                text: c.text,
                pageNumber: 1,
                embedding
            });
        }

        res.json({ msg: "SOP uploaded and indexed successfully 📘" });

    } catch (err) {
        console.error("Upload Error:", err.message);
        res.status(500).json({ msg: "Upload failed" });
    }
};


/**
 * GET /api/admin/sops
 */
const getSOPs = async (req, res) => {
    try {
        const sops = await SOPDocument.find().sort({ createdAt: -1 });
        res.json(sops);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};


/**
 * POST /api/admin/reindex/:docId
 */
const reindexSOP = async (req, res) => {
    try {
        const { docId } = req.params;

        const sop = await SOPDocument.findOne({ docId });
        if (!sop) {
            return res.status(404).json({ msg: "SOP not found" });
        }

        // Delete old chunks
        await SOPChunk.deleteMany({ docId });

        // Re-parse PDF
        const parsed = await parsePDF(`uploads/${sop.fileName}`);
        const chunks = chunkText(parsed.text);

        for (const c of chunks) {
            const embedding = await generateEmbedding(c.text);

            await SOPChunk.create({
                chunkId: c.chunkId,
                docId,
                text: c.text,
                pageNumber: 1,
                embedding
            });
        }

        res.json({ msg: "SOP reindexed successfully 🔄" });

    } catch (err) {
        console.error("Reindex Error:", err.message);
        res.status(500).json({ msg: "Reindex failed" });
    }
};


/**
 * DELETE /api/admin/sop/:docId
 */
const deleteSOP = async (req, res) => {
    try {
        const { docId } = req.params;

        const sop = await SOPDocument.findOne({ docId });
        if (!sop) {
            return res.status(404).json({ msg: "SOP not found" });
        }

        // Delete chunks
        await SOPChunk.deleteMany({ docId });

        // Delete file
        const filePath = `uploads/${sop.fileName}`;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete document
        await SOPDocument.deleteOne({ docId });

        res.json({ msg: "SOP deleted successfully 🗑️" });

    } catch (err) {
        console.error("Delete Error:", err.message);
        res.status(500).json({ msg: "Delete failed" });
    }
};

/* ================================
   Final Export (ONLY THIS)
================================ */

module.exports = {
    upload,
    uploadSOP,
    getSOPs,
    reindexSOP,
    deleteSOP
};
