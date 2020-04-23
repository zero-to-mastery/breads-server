require('dotenv').config();
let express = require('express'),
    app = express(),
    bodyParser  = require('body-parser'),
    errorHandler = require('./controllers/error').errorHandler,
    authRoutes = require('./routes/auth'),
    readingRoutes = require('./routes/readings'),
    // cors = require('cors'),
    auth = require('./middleware/auth'),
    readings = require('./controllers/readings'),
    users = require('./controllers/users'),
    subscriptions = require('./controllers/subscriptions'),
    notifications = require('./controllers/notifications');

const PORT = process.env.PORT || 8080;

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) res.send(200);
    else next();
});

app.set('views', './views');
app.set('view engine', 'ejs');
// app.use(cors());
// app.options('*', cors())
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));



app.use('/api/auth/', authRoutes);
// /api/users/ PUT DELETE
app.use('/api/users/:id/readings',
        auth.loginRequired, auth.ensureCorrectUser,
        readingRoutes);

// refactor
app.get('/api/users', users.findAllUsers); //req.query for search how to query in react?  GET users/:id/readings (above)
app.get('/api/users/:id', users.findPubs); //GET POST DELETE users/:id/subscriptions GET PUT users/:id/notifications
// app.get('/api/users/:id/edit') findById
app.put('/api/users/:id', users.updateUser) //change pubs url
app.get('/api/search/:search', users.search);
app.get('/api/readings', readings.findAllReadings);
app.get('/api/readings/:id', readings.findUserReadings); // GET readings/:id/summary   GET readings/:id/subscriptions??
app.get('/api/summary/:id', readings.summarizeReading); // child of readings
app.post('/api/subscribe', subscriptions.createSubscription); //subscriptions child of users
app.get('/api/subscriptions/:id', subscriptions.findUserSubscriptions); // child of users
app.delete('/api/users/:sub_id/subscriptions/:pub_id', subscriptions.deleteSubscription); // child of users
app.get('/api/notifications/:id', notifications.findNewSubscriptions); // child of users
app.put('/api/notifications/:id', notifications.removeNotification); // child of users

app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(errorHandler);

app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}!`);
});