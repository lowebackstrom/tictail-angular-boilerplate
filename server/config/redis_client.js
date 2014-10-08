var config = require('./config'),
    url = require('url'),
    redis = require("redis"),
    redisURL = url.parse(config.redis_url),
    redisClient = redis.createClient(redisURL.port, redisURL.hostname, {
        no_ready_check: true
    });

module.exports = function () {
    if (redisURL.auth) {
        redisClient.auth(redisURL.auth.split(":")[1]);
    }

    return redisClient;
}
