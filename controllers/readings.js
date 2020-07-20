let Reading = require('../models/reading');

exports.createReading = async (req, res, next) => {
    try {
        let reading = await Reading.create(req.body.url, req.params.id);
        return res.status(200).json(reading);
    }
    catch (err) {
        console.log('createReading - controllers/readings');
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
                }
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
                }
            }
        });
        return res.status(200).json(user);
    }
    catch (err) {
        console.log('findUserReadings - controllers/readings');
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
                }
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