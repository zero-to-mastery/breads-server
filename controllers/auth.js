let User = require('../models/user').User,
    jwt = require('jsonwebtoken'),
    comparePassword = require('../helpers/auth').comparePassword;
    users = require('../helpers/users');

exports.signup = async function(req, res, next) {
    try {
        let newUser = new User(req.body.first_name, req.body.last_name, req.body.username, req.body.email, req.body.password, req.body.image);
        let userId = await users.create(newUser);
        let token = jwt.sign(
            { 
                id: userId.insertId,
                username: newUser.username,
                image: newUser.image
            }, 
            process.env.SECRET_KEY
        );
        return res.status(200).json({ 
            id: userId.insertId,
            username: newUser.username,
            image: newUser.image,
            token
        });
    }
    catch (err) {
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
        let user = await users.findByUsername(username)
        comparePassword(password, user[0].password, function(err, isMatch) {
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