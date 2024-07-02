const multer = require("multer");
const path = require("path");
const fs = require("fs");

const configureFileUpload = () => {
  const uploadDir = path.join(process.cwd(), "uploads", "media");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();
      cb(null, fileName + fileExt);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "video/mp4"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  }).fields([
    { name: "image", maxCount: 1 },
    { name: "slider", maxCount: 3 },
    { name: "media", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "KYC", maxCount: 2 },
  ]);

  return upload;
};

module.exports = configureFileUpload;
