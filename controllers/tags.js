let Tags = require('../models/tags');

exports.findAllTags = async (req, res, next) => {
    try {
        let tags = await Tags.findAll();
        return res.status(200).json(tags);
    }
    catch (err) {
        console.log('findTagsByReadingId - controllers/tags');
        console.log(err);
        return next(err);
    }
}

exports.findReadingTags = async (req, res, next) => {
    try {
        let tags = await Tags.findTagsByReadingId(req.params.id);
        return res.status(200).json(tags);
    }
    catch (err) {
        console.log('findTagsByReadingId - controllers/tags');
        console.log(err);
        return next(err);
    }
}