require('dotenv').config();
let express = require('express'),
    app = express(),
    bodyParser  = require('body-parser'),
    errorHandler = require('./controllers/error').errorHandler,
    authRoutes = require('./routes/auth'),
    userRoutes = require('./routes/users'),
    readingRoutes = require('./routes/readings'),
    searchRoutes = require('./routes/search');

const PORT = process.env.PORT || 8080;

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) res.send(200);
    else next();
});

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/search', searchRoutes);

app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(errorHandler);

app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}!`);
});