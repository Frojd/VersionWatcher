'use strict';

var http = require('https');
var cors = require('../utils/cors');

function corsHandler(event, context, callback) {
    let queryStringParameters = event.queryStringParameters || {};
    let corsUrl = queryStringParameters.corsUrl;

    http.get(corsUrl, (res) => {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            const response = {
                statusCode: 200,
                headers: cors.getCorsXApiHeaders(),
                body: body
            };
            callback(null, response)
        });
    });
}

module.exports = {
    corsHandler,
}
