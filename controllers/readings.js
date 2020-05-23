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
        let allWebsites = await Reading.findWebsites();
        return res.status(200).json({
            data: allReadings,
            websites: allWebsites
        });
    }
    catch (err) {
        console.log('findAllReadings - controllers/readings');
        return next(err);
    }
}

exports.findUserReadings = async (req, res, next) => {
    try {
        let userReadings = await Reading.findByUserId(req.params.id);
        let userWebsites = await Reading.findWebsitesByUserId(req.params.id);
        return res.status(200).json({
            data: userReadings,
            websites: userWebsites
        });
    }
    catch (err) {
        console.log('findUserReadings - controllers/readings');
        return next(err);
    }
}

exports.markFavorite = async (req, res, next) => {
    try {
        console.log(req.params.id, req.params.user_id);
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
        console.log(req.params.id, req.params.user_id);
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