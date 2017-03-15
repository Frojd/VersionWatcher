'use strict';

const getDocumentClient = require('./db').getDocumentClient;

function stableReleases(params) {
    let docClient = getDocumentClient();

    var params = {
        TableName: "VersionWatcherStable",
    };

    return new Promise(
        (resolve, reject) => {
            docClient.scan(params, function(err, data) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        }
    );
}

function filterStableReleases(params) {
    let docClient = getDocumentClient();

    var params = {
        ExpressionAttributeValues: {
            ":project_branch": `${params.project}:${params.branch}`,
        },
        KeyConditionExpression: "project_branch = :project_branch",
        TableName: "VersionWatcherStable"
    };

    return new Promise(
        (resolve, reject) => {
            docClient.query(params, function(err, data) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        }
    );
}

function getRelease(params) {
    let docClient = getDocumentClient();

    var params = {
        Key: params,
        TableName: "VersionWatcher"
    };

    return new Promise(
        (resolve, reject) => {
            docClient.get(params, function(err, data) {
                if (err) {
                    return reject(err);
                }

                resolve(data);
            });
        }
    );
}

function stableHandler (event, context, callback) {
    let docClient = getDocumentClient();
    let project = event.queryStringParameters.project;
    let branch = "master";

    (project ? filterStableReleases({
        project,
        branch,
    }) : stableReleases()).then((data) => {
        let releases = data.Items.map((item) => {
            return {
                project: item.project,
                version: item.version,
            };
        });

        let promises = releases.map((item) => {
            return getRelease(item);
        });

        Promise.all(promises).then((values) => {
            values = values.map((item) => {
                return item.Item;
            });

            const response = {
                statusCode: 200,
                body: JSON.stringify({
                    values,
                }),
            };

            callback(null, response);
        }, (error) => {
            callback(error);
        });
    }, (err) => {
        callback(err);
    });
}

module.exports = {
    stableHandler,
}
