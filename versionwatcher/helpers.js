'use strict';

const getDocumentClient = require('./db').getDocumentClient;

function track(params, callback) {
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

    docClient.put(model, function(err, data) {
        callback(err, data);
    });
}

module.exports = {
    track,
}
