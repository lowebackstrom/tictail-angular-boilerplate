var schema,
    mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;


schema = mongoose.Schema({
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    store: {
        id: {
            type: String,
            required: true
        },
        language: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        currency: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    lastLoginAt: {
        type: Date
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    activatedAt: {
        type: Date
    },
    storeToken: {
        type: String,
        required: true
    },
    accessToken: {
        type: String
    }
});


schema.plugin(passportLocalMongoose);


schema.pre('save', function (next) {
    var user = this;
    this.updated_at = new Date;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});


// Password verification
schema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


// 'Remember Me' helper method
schema.methods.generateRandomToken = function () {
    var user = this,
        chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
        token = new Date().getTime() + '_';
    for (var x = 0; x < 16; x++) {
        var i = Math.floor(Math.random() * 62);
        token += chars.charAt(i);
    }
    return token;
};


module.exports = mongoose.model('User', schema);
