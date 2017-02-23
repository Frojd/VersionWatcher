'use strict';

module.exports.trackPHP = (event, context, callback) => {
    // project
    // stage
    // secret
    // data
    //
    const result = JSON.parse(event.body)
    // const result = {};

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Go Serverless v1.0! Your function executed successfully!',
            result: result,
            input: event,
        }),
    };

    callback(null, response);

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
