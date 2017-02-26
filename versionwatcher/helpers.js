const getDocumentClient = require('./db').getDocumentClient;

function track(params, callback) {
    const docClient = getDocumentClient();
    const model = {
        TableName: 'VersionWatcher',
        Item: {
            'project': params.project,
            'version': params.version,
            'label': params.label,
            'languages': params.languages,
            'packages': params.packages,
        }
    };

    docClient.put(model, function(err, data) {
        callback(err, data);
    });
}

module.exports = {
    track: track,
}
