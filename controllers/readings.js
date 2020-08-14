let Reading = require('../models/reading'),
    Tags = require('../models/tags');

exports.createReading = async (req, res, next) => {
    try {
        let reading = await Reading.create(req.body.url, req.params.id);
        if (req.body.tags) {
            await Tags.create(req.body.tags);
            await Tags.addToReading(req.body.url, req.body.tags, req.params.id);
        }
        return res.status(200).json(reading);
    }
    catch (err) {
        console.log('createReading - controllers/readings');
        console.log(err);
        return next(err);
    }
}

exports.summarizeReading = async (req, res, next) => {
    try {
        let article = await Reading.findById(req.params.id);
        let summary = await Reading.summarize(article[0].url);
        return res.status(200).json({
            id: req.params.id,    
            data: summary
        });
    }
    catch (err) {
        console.log('summarizeReading - controllers/readings');
        return next(err);
    }
}

exports.findAllReadings = async (req, res, next) => {
    try {
        let allReadings = await Reading.findAll();
        let all = allReadings.map(reading => {
            return reading = {
                'id': reading.id,
                'title': reading.title,
                'domain': reading.domain,
                'description': reading.description,
                'reading_image': reading.readings_image,
                'word_count': reading.word_count,
                'url': reading.url,
                'created_at': reading.created_at,
                'favorite': reading.favorite,
                'reader': {
                    'id': reading.user_id,
                    'username': reading.username,
                    'image': reading.image
                },
                'tags': reading.tag_ids ? reading.tag_ids.split(',') : null
            }
        });
        return res.status(200).json(all);
    }
    catch (err) {
        console.log('findAllReadings - controllers/readings');
        return next(err);
    }
}

exports.findUserReadings = async (req, res, next) => {
    try {
        let userReadings = await Reading.findByUserId(req.params.id);
        let user = userReadings.map(reading => {
            return reading = {
                'id': reading.id,
                'title': reading.title,
                'domain': reading.domain,
                'description': reading.description,
                'reading_image': reading.readings_image,
                'word_count': reading.word_count,
                'url': reading.url,
                'created_at': reading.created_at,
                'favorite': reading.favorite,
                'reader': {
                    'id': reading.user_id,
                    'username': reading.username,
                    'image': reading.image
                },
                'tags': reading.tag_ids ? reading.tag_ids.split(',') : null
            }
        });
        return res.status(200).json(user);
    }
    catch (err) {
        console.log('findUserReadings - controllers/readings');
        return next(err);
    }
}

exports.findSubscriptionReadings = async (req, res, next) => {
    try {
        let subReadings = await Reading.findSubReadings(req.params.id);
        let sub = subReadings.map(reading => {
            return reading = {
                'id': reading.id,
                'title': reading.title,
                'domain': reading.domain,
                'description': reading.description,
                'reading_image': reading.readings_image,
                'word_count': reading.word_count,
                'url': reading.url,
                'created_at': reading.created_at,
                'favorite': reading.favorite,
                'reader': {
                    'id': reading.user_id,
                    'username': reading.username,
                    'image': reading.image
                },
                'tags': reading.tag_ids ? reading.tag_ids.split(',') : null
            }
        });
        return res.status(200).json(sub);
    }
    catch (err) {
        console.log('findSubscriptionReadings - controllers/readings');
        return next(err);
    }
}

exports.findFavoriteReadings = async (req, res, next) => {
    try {
        let favoriteReadings = await Reading.findFavoriteReadings(req.params.id);
        let fav = favoriteReadings.map(reading => {
            return reading = {
                'id': reading.id,
                'title': reading.title,
                'domain': reading.domain,
                'word_count': reading.word_count,
                'url': reading.url,
                'created_at': reading.created_at,
                'favorite': reading.favorite,
                'reader': {
                    'id': reading.user_id,
                    'username': reading.username,
                    'image': reading.image
                },
                'tags': reading.tag_ids ? reading.tag_ids.split(',') : null
            }
        });
        return res.status(200).json(fav);
    }
    catch (err) {
        console.log('findFavoriteReadings - controllers/readings');
        return next(err);
    }
}

exports.markFavorite = async (req, res, next) => {
    try {
        let favoritedReading = await Reading.markFavorite(req.params.id, req.params.user_id);
        return res.status(200).json(favoritedReading);
    }
    catch (err) {
        console.log('markFavorite - controllers/readings');
        return next(err);
    }
}

exports.deleteFavorite = async (req, res, next) => {
    try {
        let favoritedReading = await Reading.deleteFavorite(req.params.id, req.params.user_id);
        return res.status(200).json(favoritedReading);
    }
    catch (err) {
        console.log('markFavorite - controllers/readings');
        return next(err);
    }
}

exports.deleteReading = async (req, res, next) => {
    try {
        let deletedReading = await Reading.delete(req.params.reading_id);
        return res.status(200).json(deletedReading);
    }
    catch (err) {
        console.log('deleteReading - controllers/readings');
        return next(err);
    }
}

exports.updateReading = async (req, res, next) => {
    try {
        // console.log(req.body.url, req.body.user_id, req.params.reading_id)
        let reading = await Reading.update(req.body.url, req.body.user_id, req.params.reading_id);
        return res.status(200).json(reading);
    }
    catch (err) {
        console.log('updateReading - controllers/readings');
        return next(err);
    }
}