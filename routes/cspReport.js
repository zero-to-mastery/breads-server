let express = require('express'),
    router = express.Router({ mergeParams: true });

router.post('/api/csp-report', (req, res) => {
    console.log('CSP header violation', req.body['csp-report'])
    return res.status(204);
});

module.exports = router;