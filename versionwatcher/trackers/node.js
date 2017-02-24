'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

function handler(event, context, callback) {
    const packageJson = JSON.parse(event.body);
    const project = event.queryStringParameters.project;

    let packages = [];
    for(let key in packageJson.dependencies) {
        packages.push({
            "name": key,
            "version": packageJson.dependencies[key]
        });
    }

    for(let key in packageJson.devDependencies) {
        packages.push({
            "name": key,
            "version": packageJson.devDependencies[key]
        });
    }

    let params = {
        TableName: 'VersionWatcher',
        Item: {
            'project': project,
            'version': packageJson.version,
            'label': 'node',
            'languages': 'javascript',
            'packages': packages
        }
    };

    docClient.put(params, function(err, data) {
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                err: err,
                data: data,
            }),
        };

        callback(null, response);
    });
};

module.exports = {
    handler
}
