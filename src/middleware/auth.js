require("dotenv").config();
const jwt = require("jsonwebtoken"),
  multer = require("multer"),
  cloudinary = require("cloudinary").v2;

exports.loginRequired = function (req, res, next) {
  try {
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (decoded) return next();
      else
        next({
          status: 401,
          message: "Please log in first",
        });
    });
  } catch (err) {
    next({
      status: 401,
      message: "Please log in first",
    });
  }
};

exports.ensureCorrectUser = function (req, res, next) {
  try {
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (decoded && decoded.id == req.params.id) return next();
      else
        next({
          status: 401,
          message: "Unauthorized",
        });
    });
  } catch (err) {
    next({
      status: 401,
      message: "Unauthorized",
    });
  }
};

const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

exports.handleFormData = multer({ storage, fileFilter: imageFilter });

exports.cloudinaryConfig = (req, res, next) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  next();
};
