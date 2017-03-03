'use strict';

const helpers = require('../helpers')

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
    const commit = event.queryStringParameters.commit;

    let packages = JSON.parse(event.body);
    packages = pluginsToPackages(packages);

    packages = [].concat(packages, {
        name: 'wordpress',
        version: wpVersion,
    });

    let promises = [
        helpers.track({
            project,
            version,
            branch,
            commit,
            packages,
            label: 'wordpress',
            languages: 'php',
        }),
        helpers.isStable({project, branch, version}) ? helpers.trackStable({
            project,
            branch,
            version,
        }) : null
    ]

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
    pluginsToPackages,
};
