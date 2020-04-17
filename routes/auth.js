let express = require('express'),
    router = express.Router(),
    controllers = require('../controllers/auth');

router.post('/signup', controllers.signup);
router.post('/signin', controllers.signin);

module.exports = router;