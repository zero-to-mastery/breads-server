let readings = require('../helpers/readings');
    // Reading = require('../models/reading').Reading

exports.createReading = async (req, res, next) => {
    try {
        let reading = await readings.create(req.body.url, req.params.id);
        return res.status(200).json(reading);
    }
    catch (err) {
        console.log('createReading - catch block - controllers/readings');
        return next(err);
    }
}

exports.summarizeReading = async (req, res, next) => {
    try {
        let article = await readings.findById(req.params.id);
        let summary = await readings.summarize(article[0].url);
        return res.status(200).json({
            id: req.params.id,    
            data: summary
        });
    }
    catch (err) {
        console.log('summarizeReading - catch block - controllers/readings');
        return next(err);
    }
}

exports.findAllReadings = async (req, res, next) => {
    try {
        let allReadings = await readings.findAll();
        return res.status(200).json(allReadings);
    }
    catch (err) {
        console.log('findAllreadings - controllers/readings');
        return next(err);
    }
}

exports.findUserReadings = async (req, res, next) => {
    try {
        let userReadings = await readings.findByUserId(req.params.id);
        return res.status(200).json(userReadings);
    }
    catch (err) {
        console.log('findUserreadings - controllers/readings');
        return next(err);
    }
}

exports.deleteReading = async (req, res, next) => {
    try {
        let deletedReading = await readings.delete(req.params.reading_id);
        return res.status(200).json(deletedReading);
    }
    catch (err) {
        console.log('deleteReading - controllers/readings');
        return next(err);
    }
}