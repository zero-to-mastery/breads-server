let Reading = require('../models/reading'),
    User = require('../models/user');


exports.searchAll = async (req, res, next) => {
    try {
        let users = await User.findAll();
        let readings = await Reading.findAll();
        return res.status(200).json({
            users,
            readings
        })
    }
    catch (err) {
        console.log('searchAll - controllers/search');
        return next(err);
    }
}

exports.searchUsers = async (req, res, next) => {
    try {
        let results = await User.findBySearch(req.query.users);
        return res.status(200).json(results);
    }
    catch (err) {
        console.log('search - controllers/users');
        return next(err);
    }
}