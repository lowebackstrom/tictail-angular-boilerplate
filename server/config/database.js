var config = require('./config');
mongoose = require('mongoose');


module.exports = function () {
    mongoose.connect(config.mongodb_url);

    var database = mongoose.connection;

    database.on('error', console.error.bind(console, 'connection error:'));

    database.once('open', function callback() {
        console.log('Connected to database');
    });

    return database;
}
