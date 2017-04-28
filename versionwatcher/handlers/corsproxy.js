'use strict';

var fetch = require('node-fetch');

function corsHandler(event, context, callback) {
    let queryStringParameters = event.queryStringParameters || {};
    let corsUrl = queryStringParameters.corsUrl;

    fetch(corsUrl, {
        method: 'get'
    }).then(function(response) {
        return response.text();
    }).then(function(text) {
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
            },
            body: text
        };

        callback(null, response);
    }).catch(function(err) {
        callback(err);
    });
}

module.exports = {
    corsHandler,
}
