let User = require('../models/user').User,
    jwt = require('jsonwebtoken'),
    comparePassword = require('../helpers/auth').comparePassword,
    users = require('../helpers/users'),
    transporter = require('../helpers/auth').transporter,
    getPasswordResetURL = require('../helpers/auth').getPasswordResetURL,
    resetPasswordTemplate = require('../helpers/auth').resetPasswordTemplate,
    usePasswordHashToMakeToken = require('../helpers/auth').usePasswordHashToMakeToken;


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
        console.log(username);
        console.log(password);
        let user = await users.findByUsername(username);
        console.log('password' + user);
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

//PASSWORD RESET

exports.sendPasswordResetEmail = async (req, res, next) => {
    const { email } = req.body;
    let user;
    try {
        user = await users.findByEmail(email);
    } catch (err) {
        return next({
            status: 404,
            message: 'No user with that email'
        });
    }
    const token = usePasswordHashToMakeToken(user);
    const url = getPasswordResetURL(user, token);
    const emailTemplate = resetPasswordTemplate(user, url);
  
    const sendEmail = () => {
        transporter.sendMail(emailTemplate, (err, info) => {
            if (err) {
                return next({
                    status: 500,
                    message: 'Error sending email'
                });
            }
            // console.log(`** Email sent **`, info.response)
            return res.status(202).json('Reset password email sent')
        })
    }
    sendEmail();
}

exports.receiveNewPassword = (req, res, next) => {
    const { username, token } = req.params;
    const { password } = req.body;
  
    users.findByUsername(username)
        .then(user => {
            const secret = user[0].password + '-' + user[0].createdAt;
            const payload = jwt.decode(token, secret);
            console.log(payload);
            if (payload.id === user[0].id) {
                bcrypt.genSalt(10, function(err, salt) {
                    if (err) return;
                    bcrypt.hash(password, salt, function(err, hash) {
                        if (err) return;
                        users.findByIdAndUpdate({ password: hash }, user[0].id)
                            .then(() => res.status(202).json('Password changed accepted'))
                            .catch(err => next(res.status(500).json(err)));
                    })
                })
            }
        })
        .catch(() => {
            return next({
                status: 404,
                message: 'Invalid user'
            });
        });
}