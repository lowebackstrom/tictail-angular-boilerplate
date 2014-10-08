var config = require('./config/config'),
    database = require('./config/database')(),
    server = require('./config/server')(),
    passport = require('./config/passport').passport,
    strategy = require('./config/passport').strategy;


require('./routes')(server);
