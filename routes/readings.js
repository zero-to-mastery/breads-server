let express = require('express'),
    router = express.Router({ mergeParams: true }),
    readings = require('../controllers/readings');

router.get('', readings.findAllReadings);
router.get('/:id', readings.findUserReadings);
router.get('/:id/subscriptions', readings.findSubscriptionReadings);
router.get('/:id/favorites', readings.findFavoriteReadings)
router.get('/:id/summary', readings.summarizeReading);
router.post('/:id/favorite/:user_id', readings.markFavorite);
router.delete('/:id/favorite/:user_id', readings.deleteFavorite);

module.exports = router;