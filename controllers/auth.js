const   jwt = require('jsonwebtoken'),
        User = require('../models/user'),
        helpers = require('../helpers/auth');

exports.signup = async (req, res, next) => {
    try {
        const userImage = helpers.getImage();
        const passwordHash = helpers.generateHash(req.body.password);

        const user = await User.create([
            req.body.first_name,
            req.body.last_name,
            req.body.username,
            req.body.email,
            passwordHash,
            userImage
        ]);

        const token = helpers.createToken(user.insertId, req.body.username, userImage);
        
        return res.status(200).json({ 
            id: user.insertId,
            username: req.body.username,
            image: userImage,
            token
        });
    }
    catch (err) {
        console.log('controllers/auth - signup');
        console.log(err);
        if (err.code === 'ER_DUP_ENTRY') {
            err.message = 'Sorry, that username and/or email is taken';
        }
        return next({
            status: 400,
            message: err.message
        });
    }
}

exports.signin = async (req, res, next) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const user = await User.findByUsername(username);

        helpers.comparePassword(password, user[0].password, (err, isMatch) => {
            if (isMatch) {
                const token = helpers.createToken(user[0].id, username, user[0].image);

                return res.status(200).json({
                    id: user[0].id,
                    username,
                    image: user[0].image,
                    token
                });
            } else {
                console.log('controllers/auth - signin');
                console.log(err);
                return next({
                    status: 400,
                    message: 'Invalid Username/Password.'
                });
            }
        });
    }
    catch (err) {
        console.log('controllers/auth - signin');
        console.log(err);
        return next({
            status: 400,
            message: 'Invalid Username/Password.'
        });
    }
}

exports.updatePassword = async (req, res, next) => {
    try {
        const { username, token } = req.params;
        const { password } = req.body;
        const user = await User.findByUsername(username);

        if (helpers.isRealUser(user[0], token)) {
            const hash = helpers.generateHash(password);
            await User.findByIdAndUpdatePassword(hash, user[0].id)
            return res.status(202).json({
                    message: 'Password changed accepted'
                });
        } else {
            console.log('controllers/auth - signin');
            console.log(err);
            return next({
                status: 400,
                message: 'Invalid Username/Password.'
            });
        }
    }
    catch (err) {
        console.log('controllers/auth - updatePassword');
        console.log(err);
        return next({
            status: 404,
            message: 'Something went wrong'
        });
    }
}

exports.sendPasswordResetEmail = async (req, res, next) => {
    try {
        const user = await User.findByEmail(req.body.email);
        const token = helpers.getEmailToken(user[0]);
        const url = helpers.getPasswordResetURL(user[0].username, token);
        const emailTemplate = helpers.emailTemplate(user[0].email, user[0].firstname, url);
        const sendEmail = helpers.sendEmail(emailTemplate, next);
        return res.status(200).json({
            message: sendEmail
        })
    } catch (err) {
        return res.status(404).json({
            message: 'Error sending email'
        });
    }
}