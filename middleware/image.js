let multer = require('multer'),
    Datauri = require('datauri'),
    path = require('path');

let storage = multer.memoryStorage();

let imageFilter = (req, file, cb) => {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

exports.upload = multer({ storage, fileFilter: imageFilter });

const dUri = new Datauri();

/**
* @description This function converts the buffer to data url
* @param {Object} req containing the field object
* @returns {String} The data url from the string buffer
*/

exports.dataUri = req => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);