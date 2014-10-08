var env = process.env.ENV || 'development',
    config = require('./env/' + env + '.json');

config.port = process.env.PORT || 3000;
config.mongodb_url = process.env.MONGOHQ_URL || config.mongodb_url;
config.redis_url = process.env.REDISCLOUD_URL || config.redis_url;

module.exports = config;
