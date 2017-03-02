'use strict';

const track = require('../helpers').track;

function handler(event, context, callback) {
    const wpVersion = event.queryStringParameters.wpversion;
    const project = event.queryStringParameters.project;
    const version = event.queryStringParameters.version;

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
        version: version,
        packages: packages,
        label: 'wordpress',
        languages: 'php',
    }, (err, model) => {
        //if (err) {
            //return callback(err);
        //}

        const response = {
            statusCode: 200,
            body: JSON.stringify({
                error: err,
                input: event,
                wpVersion: wpVersion,
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
};
