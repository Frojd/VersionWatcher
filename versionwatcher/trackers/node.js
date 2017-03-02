'use strict';

const track = require('../helpers').track;

function handler(event, context, callback) {
    const packageJson = JSON.parse(event.body);
    const project = event.queryStringParameters.project;
    const version = event.queryStringParameters.version;
    const branch = event.queryStringParameters.branch;
    const commit = event.queryStringParameters.commit;

    let packages = [];
    let devPackages = [];

    packages = Object.keys(packageJson.dependencies).map((key) => {
        return {
            name: key,
            version: packageJson.dependencies[key]
        }
    });

    devPackages = Object.keys(packageJson.devDependencies).map((key) => {
        return {
            name: key,
            version: packageJson.dependencies[key]
        }
    });

    packages = packages.concat(devPackages);

    track({
        project,
        version,
        branch,
        commit,
        packages,
        label: 'node',
        languages: 'javascript',
    }, (err, model) => {
        if (err) {
            return callback(err);
        }

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
    });
};

module.exports = {
    handler,
}
