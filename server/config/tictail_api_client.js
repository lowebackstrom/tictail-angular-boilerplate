var rest = require('rest'),
    pathPrefix = require('rest/interceptor/pathPrefix'),
    errorCode = require('rest/interceptor/errorCode'),
    mime = require('rest/interceptor/mime');


var client = rest.chain(mime)
    .chain(errorCode, {
        code: 500
    });
// .chain(pathPrefix, {
//     prefix: 'https://api.tictail.com/v1'
// });


module.exports = client;
