let notifications = require('../helpers/notifications');

exports.findNewSubscriptions = async (req, res, next) => {
    try {
        let newSubscription = await notifications.findSubscriptionsByUserId(req.params.id);
        return res.status(200).json(newSubscription);
    }
    catch (err) {
        console.log('findNewSubscriptions - controllers/notifications');
        return next({
            status: 400,
            message: err.message
        });
    }
}

exports.removeNotification = async (req, res, next) => {
    try {
        let oldNotification = notifications.remove(req.params.id);
        return res.status(200).json(oldNotification);
    }
    catch (err) {
        console.log('removeNotification - controllers/notifications');
        return next({
            status: 400,
            message: err.message
        });
    }
}