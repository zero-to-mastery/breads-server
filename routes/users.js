let express = require('express'),
    router = express.Router({ mergeParams: true }),
    auth = require('../middleware/auth'),
    users = require('../controllers/users'),
    notifications = require('../controllers/notifications'),
    subscriptions = require('../controllers/subscriptions'),
    readings = require('../controllers/readings'),
    sendEmail = require('../controllers/auth').sendPasswordResetEmail,
    receiveNewPassword = require('../controllers/auth').receiveNewPassword;


router.get('', users.findAllUsers);
router.get('/:id', users.findUser);
router.put('/:id', users.updateUser);
// DELETE /api/users/:id

// READINGS
router.post('/:id/readings', auth.loginRequired, auth.ensureCorrectUser, readings.createReading);
router.delete('/:id/readings/:reading_id', auth.loginRequired, auth.ensureCorrectUser, readings.deleteReading);

// SUBSCRIPTIONS
router.get('/:id/subscriptions', users.findSubscriptions);
router.post('/:id/subscriptions', subscriptions.createSubscription);
router.delete('/:user_id/subscriptions/:sub_id', subscriptions.deleteSubscription);

// NOTIFICATIONS
router.get('/:id/notifications', notifications.findNewSubscriptions);
router.put('/:id/notifications', notifications.removeNotification);

// FAVORITES
router.get('/:id/favorites', users.findFavorites);

//RESET PASSWORD
router.post('/reset', sendEmail);
router.post('/:username/reset/:token', receiveNewPassword);

module.exports = router;