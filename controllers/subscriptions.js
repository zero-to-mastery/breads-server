let Subscription = require('../models/subscription');

exports.createSubscription = async (req, res, next) => {
    try {
        if (req.params.id !== req.body.sub_id) {
            let newSubscription = new Subscription(req.params.id, req.body.sub_id);
            let subscription = await Subscription.create(newSubscription);
            return res.status(200).json(subscription);
        }
    }
    catch (err) {
        console.log('createSubscription - controllers/subscriptions');
        if (err.code === 'ER_DUP_ENTRY') {
            err.message = 'You already subscribe to them!';
        }
        return next({
            status: 400,
            message: err.message
        });
    }
}

exports.findSubscriptionReadings = async (req, res, next) => {
    try {
        let subReadings = await Subscription.findSubReadings(req.params.id);
        // let subWebsites = await Subscription.findSubWebsites(req.params.id);
        let sub = subReadings.map(reading => {
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
        return res.status(200).json(sub);
            // data: ,
            // websites: subWebsites
    }
    catch (err) {
        console.log('findSubscriptionReadings - controllers/subscriptions');
        return next(err);
    }
}

exports.deleteSubscription = async (req, res, next) => {
    try {
        let deletedSubscription = await Subscription.delete(Number(req.params.user_id), Number(req.params.sub_id));
        return res.status(200).json(deletedSubscription);
    }
    catch (err) {
        console.log('deleteSubscription - controllers/subscriptions');
        return next(err);
    }
}