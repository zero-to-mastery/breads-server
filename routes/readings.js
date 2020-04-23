let express = require('express'),
    router = express.Router({ mergeParams: true }),
    subscriptions = require('../controllers/subscriptions'),
    readings = require('../controllers/readings');

router.get('', readings.findAllReadings);
router.get('/:id', readings.findUserReadings);
router.get('/:id/subscriptions', subscriptions.findSubscriptionReadings);
router.get('/:id/summary', readings.summarizeReading);

module.exports = router;