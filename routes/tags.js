let express = require('express'),
    router = express.Router({ mergeParams: true }),
    tags = require('../controllers/tags');
    
router.get('', tags.findAllTags);
router.get('/:id', tags.findUserTags);
router.post('/:id', tags.createTags);
router.get('/:id/subscriptions', tags.findSubscriptionTags);

module.exports = router;