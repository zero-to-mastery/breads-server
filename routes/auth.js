let express = require('express'),
    router = express.Router(),
    auth = require('../controllers/auth'),
    { handleFormData } = require('../middleware/auth');
    // { cloudinaryConfig } = require('../middleware/auth');

// router.post('/signup', upload.single('image'), cloudinaryConfig, auth.signup);
router.post('/signup', handleFormData.single('image'), auth.signup);
router.post('/signin', auth.signin);

module.exports = router;