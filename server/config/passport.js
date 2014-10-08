var User = require('./../models/user.js'),
    https = require('https'),
    util = require('util'),
    passport = require('passport'),
    TictailStrategy = require('./../config/tictail_passport_strategy.js');


var strategy = new TictailStrategy(function (store, done) {
    User.findOne({
        'store.id': store.id
    }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {
                message: 'Unknown store ' + store.id
            });
        }

        return done(null, user);
    });
});


passport.serializeUser(function (user, done) {
    var createAccessToken = function () {
        var token = user.generateRandomToken();
        User.findOne({
            accessToken: token
        }, function (err, existingUser) {
            if (err) {
                return done(err);
            }
            if (existingUser) {
                createAccessToken();
            } else {
                user.set('accessToken', token);
                user.save(function (err) {
                    if (err) return done(err);
                    return done(null, user.get('accessToken'));
                })
            }
        });
    };

    if (user._id) {
        createAccessToken();
    }
});


passport.deserializeUser(function (token, done) {
    User.findOne({
        accessToken: token
    }, function (err, user) {
        done(err, user);
    });
});


passport.use(strategy);


module.exports = {
    passport: passport,
    strategy: strategy
};
