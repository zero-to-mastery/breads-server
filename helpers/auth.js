let bcrypt = require('bcrypt'),
    nodemailer = require('nodemailer'),
    jwt = require('jsonwebtoken');

exports.comparePassword = function(candidatePassword, password, next) {
    bcrypt.compare(candidatePassword, password, function(err, isMatch) {
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