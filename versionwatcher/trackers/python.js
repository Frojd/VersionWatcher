'use strict';

const track = require('../helpers').track;

function pipToArray(data) {
    data = data.replace(/\\n/g, '\n');
    data = data.split(/(\r\n|\r|\n)/g);
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
    let packages = event.body;
    const project = event.queryStringParameters.project;
    const label = event.queryStringParameters.label;
    const version = event.queryStringParameters.version;
    const branch = event.queryStringParameters.branch;

    packages = pipToArray(packages);

    track({
        project,
        version,
        branch,
        packages,
        label: label,
        languages: 'python',
    }, (err, model) => {
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                error: err,
                input: event,
                project: project,
                version: version,
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
