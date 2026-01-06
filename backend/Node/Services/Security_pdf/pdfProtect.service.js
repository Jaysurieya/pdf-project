const { exec } = require("child_process");
const path = require("path");
const os = require("os");
const { randomUUID } = require("crypto");

module.exports = (inputPath, password) => {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(
      os.tmpdir(),
      `${randomUUID()}_protected.pdf`
    );

    const cmd = `qpdf --encrypt ${password} ${password} 256 -- "${inputPath}" "${outputPath}"`;

    exec(cmd, (error) => {
      if (error) {
        return reject(error);
      }
      resolve(outputPath);
    });
  });
};