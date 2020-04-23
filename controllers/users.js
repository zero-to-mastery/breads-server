let users = require('../helpers/users');

exports.findAllUsers = async (req, res, next) => {
    try {
        let allUsers = await users.findAll();
        return res.status(200).json(allUsers);
    }
    catch (err) {
        console.log('findAllUsers - controllers/users');
        return next(err);
    }
}

exports.findSubscriptions = async (req, res, next) => {
    try {
        let subscriptions = await users.findSubscriptionsById(req.params.id);
        return res.status(200).json(subscriptions);
    }
    catch (err) {
        console.log('findSubscriptions - controllers/users');
        return next(err);
    }
}

exports.searchUsers = async (req, res, next) => {
    try {
        let results = await users.findBySearch(req.query.users);
        return res.status(200).json(results);
    }
    catch (err) {
        console.log('search - controllers/users');
        return next(err);
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        let updated = await users.findByIdAndUpdate(req.params.id, req.body.image, req.body.username);
        let updatedUser = await users.findById(req.params.id);
        return res.status(200).json({
            id: updatedUser[0].id,
            username: updatedUser[0].username,
            image: updatedUser[0].image
        });
    }
    catch (err) {
        console.log('updateUser - controllers/users');
        return next(err);
    }
}