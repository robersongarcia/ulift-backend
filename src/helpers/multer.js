const multer = require("multer");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __basedir + "/public/images/");
    },
    filename: (req, file, cb) => {
      file.originalname = file.originalname.replace(/\s/g, '');
      file.newFileName = `${file.originalname.slice(0, file.originalname.indexOf("."))}-${Date.now()}-profile`;
      cb(null, `${file.newFileName}`);
    },
  });

const uploadFile = multer({ storage: storage, fileFilter: imageFilter });

module.exports = uploadFile;