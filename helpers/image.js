require('dotenv').config();
let cloudinary = require('cloudinary').v2;

exports.cloudinaryConfig = (req, res, next) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    next();
}

exports.uploads = file => {
    let imageUpload = new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file, {resource_type: 'auto'}, function(err, result) {
            if (err) reject(err);
            else {
                resolve({url: result.url, id: result.public_id})
            }
        });
    });
    return imageUpload;
}