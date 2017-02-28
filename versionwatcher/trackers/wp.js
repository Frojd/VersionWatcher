'use strict';

const track = require('../helpers').track;

function handler(event, context, callback) {
    const wpVersion = event.queryStringParameters.wpversion;
    const project = event.queryStringParameters.project;
    const release = event.queryStringParameters.release;

    let packages = JSON.parse(event.body);

    packages = packages.map((item) => {
        return {name: item.name, version: item.version};
    });

    packages = [].concat(packages, {
        name: 'wordpress',
        version: wpVersion,
    });

    track({
        project: project,
        release: release,
        packages: packages,
        label: 'wordpress',
    }, (err, model) => {
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                input: event,
                wpVersion: wpVersion,
                project: project,
                release: release,
                packages: packages,
            }),
        };

        callback(null, response);
    });
};


module.exports = {
    handler,
};
