'use strict';

const track = require('../helpers').track;

function pipToArray(data) {
    data = data.split(/\n/);
    data = data.map((value) => {
        return value.trimLeft();
    });

    data = data.filter((value) => {
        return value.indexOf('==') !== -1
    });

    data = data.map((value) => {
        value = value.split('==');
        return {
            name: value[0],
            version: value[1],
        }
    });
    return data;
}

function handler(event, context, callback) {
    const packages = event.body;
    const project = event.queryStringParameters.project;
    const label = event.queryStringParameters.label;
    const version = event.queryStringParameters.version;

    track({
        project: project,
        version: version,
        packages: pipToArray(packages),
        label: label,
        languages: 'python',
    }, (err, model) => {
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                input: event,
                version: version,
                project: project,
                packages: packages,
            }),
        };

        callback(null, response);
    });
};

module.exports = {
    handler,
    pipToArray,
}
