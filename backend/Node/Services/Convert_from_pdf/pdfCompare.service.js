const fs = require("fs");
const Diff = require("diff");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

async function extractText(pdfPath) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const pdf = await pdfjsLib.getDocument({ data }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    text += strings.join(" ") + "\n";
  }

  return text.trim();
}

module.exports = async (pdfPath1, pdfPath2) => {
  const text1 = await extractText(pdfPath1);
  const text2 = await extractText(pdfPath2);

  const diff = Diff.diffLines(text1, text2);

  const added = [];
  const removed = [];

  diff.forEach(part => {
    if (part.added) {
      added.push(...part.value.split("\n").filter(Boolean));
    } else if (part.removed) {
      removed.push(...part.value.split("\n").filter(Boolean));
    }
  });

  return {
    status: added.length === 0 && removed.length === 0 ? "same" : "different",
    added,
    removed
  };
};
