let express = require('express'),
    router = express.Router({ mergeParams: true }),
    readings = require('../controllers/readings');

router.post('/', readings.createReading);
router.delete('/:reading_id', readings.deleteReading);

module.exports = router;