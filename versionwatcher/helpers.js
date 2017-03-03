'use strict';

const getDocumentClient = require('./db').getDocumentClient;

function track(params) {
    const docClient = getDocumentClient();
    const created = params.created || Math.floor((new Date).getTime()/1000);

    const model = {
        TableName: 'VersionWatcher',
        Item: {
            project: params.project,
            version: params.version,
            branch: params.branch,
            label: params.label,
            commit: params.commit,
            languages: params.languages,
            packages: params.packages,
            created,
        }
    };

    return new Promise(
        (resolve, reject) => {
            docClient.put(model, function(err, data) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        }
    );
}

function isStable(params) {
    return params.branch === 'master';
}

function trackStable(params) {
    const docClient = getDocumentClient();
    const created = params.created || Math.floor((new Date).getTime()/1000);

    const model = {
        TableName: 'VersionWatcherStable',
        Item: {
            project_branch: `${params.project}:${params.branch}`,
            version: params.version,
            project: params.project,
            branch: params.branch,
            created,
        }
    };

    return new Promise(
        (resolve, reject) => {
            docClient.put(model, function(err, data) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        }
    );
}

module.exports = {
    track,
    isStable,
    trackStable,
}
