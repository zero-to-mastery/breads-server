let Tags = require('../models/tags');

exports.findAllTags = async (req, res, next) => {
    try {
        let allTags = await Tags.findAll();
        let tags = allTags.map(tag => {
            return tag = {
                'id': tag.id,
                'tag_name': tag.tag_name,
                'reading_id': tag.reading_id.split(','),
                'user_id': tag.user_id.split(','),
                'date': tag.date,
                'count': tag.count
            }
        });
        return res.status(200).json(tags);
    }
    catch (err) {
        console.log('findTagsByReadingId - controllers/tags');
        console.log(err);
        return next(err);
    }
}

exports.findUserTags = async (req, res, next) => {
    try {
        let userTags = await Tags.findUserTags(req.params.id);
        let tags = userTags.map(tag => {
            return tag = {
                'id': tag.id,
                'tag_name': tag.tag_name,
                'reading_id': tag.reading_id.split(','),
                'user_id': tag.user_id.split(','),
                'date': tag.date,
                'count': tag.count
            }
        });
        return res.status(200).json(tags);
    }
    catch (err) {
        console.log('findTagsByReadingId - controllers/tags');
        console.log(err);
        return next(err);
    }
}

exports.findSubscriptionTags = async (req, res, next) => {
    try {
        let userTags = await Tags.findSubscriptionTags(req.params.id);
        let tags = userTags.map(tag => {
            return tag = {
                'id': tag.id,
                'tag_name': tag.tag_name,
                'reading_id': tag.reading_id.split(','),
                'user_id': tag.user_id.split(','),
                'date': tag.date,
                'count': tag.count
            }
        });
        return res.status(200).json(tags);
    }
    catch (err) {
        console.log('findTagsByReadingId - controllers/tags');
        console.log(err);
        return next(err);
    }
}
// addTag
// updateTag
// deleteTag

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