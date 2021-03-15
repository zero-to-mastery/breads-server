require('dotenv').config();
let express = require('express'),
    app = express(),
    helmet = require('helmet'),
    bodyParser  = require('body-parser'),
    cors = require('cors'),
    compression = require('compression'),
    morgan = require('morgan'),
    errorHandler = require('./controllers/error').errorHandler,
    authRoutes = require('./routes/auth'),
    userRoutes = require('./routes/users'),
    readingRoutes = require('./routes/readings'),
    searchRoutes = require('./routes/search'),
    tagRoutes = require('./routes/tags'),
    cspReportRoutes = require('./routes/cspReport');

const PORT = process.env.PORT || 8080;

// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
//     // intercept OPTIONS method
//     if ('OPTIONS' == req.method) res.sendStatus(200);
//     else next();
// });

app.use(compression());
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'", 'https://staging-breads-server.herokuapp.com', 'https://breads-server.herokuapp.com'],
        scriptSrc: ["'self'", 'https://staging-breads-server.herokuapp.com', 'https://breads-server.herokuapp.com']
    }
}));
app.use(bodyParser.json());
app.use(morgan('combined'));

const whitelist = ['https://www.breads.io', 'https://staging-breads-client.herokuapp.com', 'https://jw00ds.github.io', process.env.LOCAL_CORS];
const corsOptions = {
    origin: function (origin, callback) {
        const isWhiteListed = whitelist.indexOf(origin) !== -1;
        const isLocal = process.env.LOCAL_CORS === `localhost:${PORT}` && !origin;
        
        if (isWhiteListed || isLocal) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

app.use(cors(corsOptions));
// Enable complex CORS requests (DELETE/OPTIONS)
app.options('*', cors());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/csp-report', cspReportRoutes);

// "Content-Security-Policy-Report-Only": "default-src 'self' https://staging-breads-server.herokuapp.com https://breads-server.herokuapp.com; script-src 'self' https://staging-breads-server.herokuapp.com https://breads-server.herokuapp.com 'sha256-IjRw88EIRqqX+VpFI3slzD4qzNuRp0RfxZuz50uE2eQ='; img-src 'self' https://images.unsplash.com http://res.cloudinary.com https://staging-breads-client.herokuapp.com https://www.breads.io data:; style-src 'self' 'sha256-UTjtaAWWTyzFjRKbltk24jHijlTbP20C1GUYaWPqg7E=' 'sha256-deDIoPlRijnpfbTDYsK+8JmDfUBmpwpnb0L/SUV8NeU='; report-uri https://staging-breads-server.herokuapp.com/api/csp-report",


app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(errorHandler);

app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}!`);
});