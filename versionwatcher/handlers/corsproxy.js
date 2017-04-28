'use strict';

var http = require('https');

function corsHandler(event, context, callback) {
    let queryStringParameters = event.queryStringParameters || {};
    let corsUrl = queryStringParameters.corsUrl;

    http.get(corsUrl, (res) => {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            const response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
                },
                body: body
            };
            callback(null, response)
        });
    });
}

module.exports = {
    corsHandler,
}
