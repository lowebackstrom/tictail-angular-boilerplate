var config = require('./config'),
    express = require('express'),
    passport = require('passport'),
    flash = require('connect-flash'),
    session = require('express-session'),
    redisClient = require('./redis_client')(),
    RedisSessionStore = require('connect-redis')(session);


module.exports = function () {
    var server = express();

    server.use(require('cookie-parser')());
    server.use(require('body-parser')());
    server.use(require('morgan')());
    server.use(require('method-override')());
    server.use(session({
        store: new RedisSessionStore({
            client: redisClient,
            db: config.redis_session_db
        }),
        secret: 'khjsdbk3ksd83ksjdk'
    }));
    server.use(passport.initialize());
    server.use(passport.session());
    server.use(flash());

    server.use(function (req, res, next) {
        var origin = 'null';
        if (config.origins.indexOf(req.headers.origin) !== -1) {
            origin = req.headers.origin;
        }

        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

        if ('OPTIONS' == req.method) {
            res.send(200);
        } else {
            next();
        }
    });

    server.listen(config.port, function () {
        console.log('listening at port %s', config.port);
    });

    return server;
}
