const fs = require('fs');
const pdfParse = require('pdf-parse').default || require('pdf-parse');

(async () => {
  const buffer = fs.readFileSync('uploads/Refund-policy.pdf');
  const data = await pdfParse(buffer);
  console.log("PDF parsed OK, chars:", data.text.length);
})();
