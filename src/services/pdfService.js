const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.mjs');

const parsePDF = async (filePath) => {
    const data = new Uint8Array(fs.readFileSync(filePath));

    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const pageText = content.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
    }

    return {
        text: fullText,
        totalPages: pdf.numPages
    };
};

module.exports = { parsePDF };
