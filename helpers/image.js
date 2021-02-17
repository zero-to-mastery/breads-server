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
            else resolve({url: result.secure_url, id: result.public_id})
        });
    });
    return imageUpload;
}

exports.setImage = index => {
    const imageUrls = [
        'https://res.cloudinary.com/breads/image/upload/v1613539776/naan_mzwzze.jpg',
        'https://res.cloudinary.com/breads/image/upload/v1613539707/breadsticks_tzpz9b.jpg',
        'https://res.cloudinary.com/breads/image/upload/v1613539680/focaccia_jasnlz.jpg',
        'https://res.cloudinary.com/breads/image/upload/v1613539636/pita_aqpuld.jpg',
        'https://res.cloudinary.com/breads/image/upload/v1613539580/tortilla_fvnmgn.jpg',
        'https://res.cloudinary.com/breads/image/upload/v1613539536/sourdough_kb4mt4.jpg',
        'https://res.cloudinary.com/breads/image/upload/v1613539497/baguette_sa1wgi.jpg',
        'https://res.cloudinary.com/breads/image/upload/v1613539400/crumpet_rlznki.jpg',
        'https://res.cloudinary.com/breads/image/upload/v1613539360/ciabatta_y34dzx.jpg'
    ]

    return imageUrls[index];
}