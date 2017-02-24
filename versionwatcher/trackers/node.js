'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

function handler(event, context, callback) {
    // project
    // stage
    // secret
    // data
    //
    // const body = JSON.parse(event.input.body);


    let params = {
        TableName: 'VersionWatcher',
        Item: {
            'project': 'Frojd/HRF-HRF.se',
            'version': '4.5.0',
            'type': 'WordPress',
            'languages': 'php',
            'packages': [
                {
                    "react": "2.6.0"
                },
                {
                    "webpack": "2.3.0"
                }
            ]
        }
    };

    docClient.put(params, function(err, data) {
        if (err) {
            console.log('Unable to add item. Error JSON: ', JSON.stringify(err, null, 2));
        } else {
            console.log('Added');
        }
    });


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
