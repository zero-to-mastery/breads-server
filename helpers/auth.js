let bcrypt = require('bcrypt'),
    nodemailer = require('nodemailer'),
    jwt = require('jsonwebtoken');

exports.comparePassword = function(candidatePassword, password, next) {
    bcrypt.compare(candidatePassword, password, function(err, isMatch) {
        if(err) return next(err);
        next(null, isMatch);
    });
}

// {
//     password: passwordHash,
//     id: id,
//     createdAt
// }

exports.usePasswordHashToMakeToken = user => {
    const { id, password, created_at } = user[0];
    const secret = password + '-' + created_at;
    const token = jwt.sign({ id }, secret, {
        expiresIn: 3600 // 1 hour
    });
    return token;
}

exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASSWORD
    }
});

exports.getPasswordResetURL = (user, token) =>
    `http://localhost:8080/api/users/${user[0].username}/reset//${token}`;

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
    `
    return { from, to, subject, html }
}
