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
      cb(null, `${req.body.email.slice(0, req.body.email.indexOf("@"))}-profile`);
    },
  });

const uploadFile = multer({ storage: storage, fileFilter: imageFilter });

module.exports = uploadFile;