let subscriptions = require('../helpers/subscriptions'),
    Subscription = require('../models/subscription').Subscription;

exports.createSubscription = async (req, res, next) => {
    try {
        if (req.body.sub_id !== req.body.pub_id) {
            let newSubscription = new Subscription(req.body.sub_id, req.body.pub_id);
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

exports.findUserSubscriptions = async (req, res, next) => {
    try {
        let userSubscriptions = await subscriptions.findPubReadings(req.params.id);
        return res.status(200).json(userSubscriptions);
    }
    catch (err) {
        console.log('findUserSubcriptions - controllers/subscriptions');
        return next(err);
    }
}

exports.deleteSubscription = async (req, res, next) => {
    try {
        let deletedSubscription = await subscriptions.delete(Number(req.params.sub_id), Number(req.params.pub_id));
        return res.status(200).json(deletedSubscription);
    }
    catch (err) {
        console.log('deleteSubscription - controllers/subscriptions');
        return next(err);
    }
}