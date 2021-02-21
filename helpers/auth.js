const   Datauri = require('datauri'),
        path = require('path'),
        bcrypt = require('bcrypt'),
        jwt = require('jsonwebtoken'),
        nodemailer = require('nodemailer'),
        cloudinary = require('cloudinary').v2

exports.getImage = () => {
    const randomIndex = Math.floor(Math.random() * imageUrls.length);
    return imageUrls[randomIndex];
}

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
];

/**
* @description This function converts the buffer to data url
* @param {Object} req.file containing the field object
* @returns {String} The data url from the string buffer
*/

exports.dataUri = file => {
    const dUri = new Datauri();
    return dUri.format(
        path.extname(file.originalname).toString(),
        req.file.buffer
    );
}

exports.generateHash = password => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

exports.comparePassword = (candidatePassword, password, next) => {
    bcrypt.compare(candidatePassword, password, (err, isMatch) => {
        if(err) return next(err);
        next(null, isMatch);
    });
}

exports.usePasswordHashToMakeToken = user => {
    const { id, password, created_at } = user[0];
    const secret = password + '-' + created_at;
    const token = jwt.sign({ id }, secret, {
        expiresIn: 3600 // 1 hour
    });
    return token;
}

exports.getPasswordResetURL = (user, token) => `${process.env.EMAIL_URL}/reset/${user[0].username}/${token}`;

exports.resetPasswordTemplate = (user, url) => {
    const from = process.env.EMAIL_LOGIN;
    const to = user[0].email;
    const subject = '🍞 Breads Password Reset 🍞';
    const html = `
        <p>Hey ${user[0].first_name || user[0].email},</p>
        <p>We heard that you lost your Breads password. Sorry about that!</p>
        <p>But don’t worry! You can use the following link to reset your password:</p>
        <a href=${url}>${url}</a>
        <p>If you don’t use this link within 1 hour, it will expire.</p>
        <p>Read something fun today! </p>
        <p>–Your friends at Breads</p>
    `;
    return { from, to, subject, html };
}

exports.sendEmail = (emailTemplate, next) => {
    transporter.sendMail(emailTemplate, (err, info) => {
        if (err) {
            console.log(err);
            return next({
                status: 500,
                message: 'Error sending email'
            });
        }
        console.log(`** Email sent **`, info.response)
        return res.status(202).json('Reset password email sent')
    })
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASSWORD
    }
});

exports.imageUpload = file => {
    const imageUpload = new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file, {resource_type: 'auto'}, function(err, result) {
            if (err) reject(err);
            else resolve({url: result.secure_url, id: result.public_id})
        });
    });
    return imageUpload;
}