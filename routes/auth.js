let express = require('express'),
    router = express.Router(),
    auth = require('../controllers/auth'),
    upload = require('../middleware/image').upload,
    cloudinaryConfig = require('../helpers/image').cloudinaryConfig;

router.post('/signup', upload.single('image'), cloudinaryConfig, auth.signup);
router.post('/signin', auth.signin);

module.exports = router;