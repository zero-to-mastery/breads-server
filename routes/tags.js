let express = require('express'),
    router = express.Router({ mergeParams: true }),
    tags = require('../controllers/tags');
    
router.get('', tags.findAllTags);
router.get('/:id', tags.findReadingTags);

module.exports = router;