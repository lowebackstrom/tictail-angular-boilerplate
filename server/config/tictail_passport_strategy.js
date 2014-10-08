var https = require('https'),
    util = require('util'),
    passport = require('passport');


function TictailStrategy(options, verify) {
    if (typeof options == 'function') {
        verify = options;
        options = {};
    }
    if (!verify) throw new Error('tictail authentication strategy requires a verify function');

    passport.Strategy.call(this);
    this.name = 'tictail';
    this._verify = verify;
}


util.inherits(TictailStrategy, passport.Strategy);


TictailStrategy.prototype.validateToken = function (token, done) {
    var request = https.get({
        hostname: 'api.tictail.com',
        path: '/v1/me',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }, function (res) {
        var data = "";

        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            done(null, JSON.parse(data));
        });
    });

    request.on('error', function (err) {
        done(err);
    });

    request.end();
}

TictailStrategy.prototype.authenticate = function (req, options) {
    var options = options || {},
        self = this,
        token = req.body.token;

    if (!token) {
        return this.fail(new Error('Missing credentials'));
    }

    function verified(err, user, info) {
        if (err) {
            return self.error(err);
        }
        if (!user) {
            return self.fail(info);
        }
        self.success(user, info);
    }

    this.validateToken(token, function (err, store) {
        if (err) {
            return self.error(err);
        }
        self._verify(store, verified);
    });
}


module.exports = TictailStrategy;
