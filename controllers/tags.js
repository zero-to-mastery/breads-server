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
                'count': tag.count,
                // 'favorite': tag.favorite,
                // 'reader': {
                //     'id': tag.user_id,
                //     'username': tag.username,
                //     'image': tag.image
                // },
                // 'tags': tag.tag_ids ? tag.tag_ids.split(',') : null
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