const   jwt = require('jsonwebtoken'),
        bcrypt = require('bcrypt'),
        User = require('../models/user'),
        helpers = require('../helpers/auth');

exports.signup = async function(req, res, next) {
    try {
        const userImage = helpers.getImage();
        const passwordHash = helpers.generateHash(req.body.password);

        const userId = await User.create([
            req.body.first_name,
            req.body.last_name,
            req.body.username,
            req.body.email,
            passwordHash,
            userImage
        ]);

        const token = jwt.sign(
            { 
                id: userId.insertId,
                username: req.body.username,
                image: userImage
            }, 
            process.env.SECRET_KEY
        );
        
        return res.status(200).json({ 
            id: userId.insertId,
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

exports.signin = async function(req, res, next) {
    try {
        let username = req.body.username,
            password = req.body.password;
        let user = await User.findByUsername(username);
        helpers.comparePassword(password, user[0].password, function(err, isMatch) {
            if (isMatch) {
                let token = jwt.sign({ 
                    id: user[0].id,
                    username,
                    image: user[0].image
                }, process.env.SECRET_KEY);
                return res.status(200).json({
                    id: user[0].id,
                    username,
                    image: user[0].image,
                    token
                });
            } else {
                return next({
                    status: 400,
                    message: 'Invalid Username/Password.'
                });
            }
        });
    }
    catch (err) {
        return next({
            status: 400,
            message: 'Invalid Username/Password.'
        });
    }
}

//PASSWORD RESET

exports.sendPasswordResetEmail = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findByEmail(email);
        const token = helpers.usePasswordHashToMakeToken(user);
        const url = helpers.getPasswordResetURL(user, token);
        const emailTemplate = helpers.resetPasswordTemplate(user, url);
        helpers.sendEmail(emailTemplate, next);
        return res.status(200).json({
            message: 'Email sent'
        });
    } catch (err) {
        return next({
            status: 404,
            message: 'Error sending email'
        });
    }
}

exports.receiveNewPassword = (req, res, next) => {
    const { username, token } = req.params;
    const { password } = req.body;

    User.findByUsername(username)
        .then(user => {
            const secret = user[0].password + '-' + user[0].createdAt;
            const payload = jwt.decode(token, secret);
            if (payload.id === user[0].id) {
                let salt = bcrypt.genSaltSync(10),
                    hash = bcrypt.hashSync(password, salt);

                User.findByIdAndUpdatePassword(hash, user[0].id)
                    .then(() => res.status(202).json({
                        message: 'Password changed accepted'
                    }))
                    .catch(err => res.status(500).json(err));
            }
        })
        .catch(() => {
            return next({
                status: 404,
                message: 'Invalid user'
            });
        });
}