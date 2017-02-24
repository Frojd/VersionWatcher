'use strict';

function handler(event, context, callback) {
    // project
    // stage
    // secret
    // data
    //
    // const body = JSON.parse(event.input.body);

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Go Serverless v1.0 NODE! Your function executed successfully!',
            input: event,
        }),
    };

    callback(null, response);

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

module.exports = {
    handler
}
