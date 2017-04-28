'use strict';

const helpers = require('../../helpers')

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
    const commit = event.queryStringParameters.commit;

    packages = pipToArray(packages);

    let promises = [
        helpers.track({
            project,
            version,
            branch,
            commit,
            packages,
            label: label,
            languages: 'python',
        }),
        helpers.isStable({project, branch, version}) ? helpers.trackStable({
            project,
            branch,
            version,
        }) : null
    ];

    Promise.all(promises).then((values) => {
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Tracking was successfull',
                project: project,
                version: version,
                packages: packages,
            }),
        };
        callback(null, response);
    }, (error) => {
        callback(error);
    });
};

module.exports = {
    handler,
    pipToArray,
}
