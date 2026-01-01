const { exec } = require("child_process");
const path = require("path");

module.exports = (inputPath, password) => {
    return new Promise((resolve, reject) => {
        const outputPath = inputPath.replace(".pdf", "_unlocked.pdf");

        const cmd = `qpdf --password=${password} --decrypt "${inputPath}" "${outputPath}"`;

        console.log("🛠 QPDF CMD:", cmd);

        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                if (stderr.toLowerCase().includes("password")) {
                    reject(new Error("WRONG_PASSWORD"));
                } else {
                    reject(new Error("UNLOCK_FAILED"));
                }
            } else {
                resolve(outputPath);
            }
        });

    });
};
