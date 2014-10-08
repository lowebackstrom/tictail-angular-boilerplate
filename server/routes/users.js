var User = require('./../models/user.js'),
    passport = require('./../config/passport').passport,
    strategy = require('./../config/passport').strategy;


function _loginUser(req, res, user, saveLastLogin) {
    saveLastLogin = saveLastLogin || true;

    req.logIn(user, function (err) {
        if (err) {
            return next(err);
        }

        if (saveLastLogin) {
            user.update({
                lastLoginAt: new Date
            }).exec();
        }

        res.send(200, {
            email: user.email,
            store: user.store,
            status: user.status,
            activated: user.activated
        });
    });
};


module.exports = function (server) {
    server.post('/register', function (req, res, next) {
        strategy.validateToken(req.body.token, function (err, response) {
            if (err) {
                res.send(401, err);
            }

            var user = new User({
                email: response.contact_email,
                store: {
                    id: response.id,
                    language: response.language,
                    currency: response.currency,
                    country: response.country,
                    url: response.url
                },
                storeToken: req.body.token,
                lastLoginAt: new Date
            });

            user.save(function (err, data) {
                if (err) {
                    return res.send(500, err);
                }

                _loginUser(req, res, user, false);
            });
        });
    });


    server.post('/login', function (req, res, next) {
        passport.authenticate('tictail', function (err, user, info) {
            if (err) {
                return next(err)
            }
            if (!user) {
                return res.send(401, info.message);
            }

            _loginUser(req, res, user);
        })(req, res, next);
    });
};
