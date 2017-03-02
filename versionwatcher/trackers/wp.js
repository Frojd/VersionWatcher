'use strict';

const track = require('../helpers').track;

function pluginsToPackages(plugins) {
    let packages = plugins.map((item) => {
        return {name: item.name, version: item.version};
    });

    packages = packages.filter((item) => {
        return item.name && item.version;
    });

    return packages;
}

function handler(event, context, callback) {
    const wpVersion = event.queryStringParameters.wpversion;
    const project = event.queryStringParameters.project;
    const version = event.queryStringParameters.version;
    const branch = event.queryStringParameters.branch;

    let packages = JSON.parse(event.body);
    packages = pluginsToPackages(packages);

    packages = [].concat(packages, {
        name: 'wordpress',
        version: wpVersion,
    });

    track({
        project,
        version,
        branch,
        packages,
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
    pluginsToPackages,
};
