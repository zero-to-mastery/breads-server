let subscriptions = require('../helpers/subscriptions'),
    Subscription = require('../models/subscription').Subscription;

exports.createSubscription = async (req, res, next) => {
    try {
        if (req.params.id !== req.body.sub_id) {
            let newSubscription = new Subscription(req.params.id, req.body.sub_id);
            let subscription = await subscriptions.create(newSubscription);
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
        let subscriptionReadings = await subscriptions.findSubReadings(req.params.id);
        return res.status(200).json(subscriptionReadings);
    }
    catch (err) {
        console.log('findSubscriptionReadings - controllers/subscriptions');
        return next(err);
    }
}

exports.deleteSubscription = async (req, res, next) => {
    try {
        let deletedSubscription = await subscriptions.delete(Number(req.params.user_id), Number(req.params.sub_id));
        return res.status(200).json(deletedSubscription);
    }
    catch (err) {
        console.log('deleteSubscription - controllers/subscriptions');
        return next(err);
    }
}