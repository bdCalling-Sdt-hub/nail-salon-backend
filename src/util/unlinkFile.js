const fs = require("fs");
const path = require("path");

const unlinkFile = (file) => {
    const fileName = file.split("/").pop();
    const filePath = path.join("uploads", "images", fileName);
    console.log(filePath)
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};
module.exports = unlinkFile;