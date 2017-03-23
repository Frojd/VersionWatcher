'use strict';

const getDocumentClient = require('../db').getDocumentClient;
const getDoc = require('../db').getDoc;
const filterVersionsByPackage = require('../helpers').filterVersionsByPackage;

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

function stableHandler(event, context, callback) {
    let docClient = getDocumentClient();
    let queryStringParameters = event.queryStringParameters || {};
    let project = queryStringParameters.project;
    let packageName = queryStringParameters.package;
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
            return getDoc({ TableName: "VersionWatcherVersion" }, item);
        });

        Promise.all(promises).then((values) => {
            values = values.map((item) => {
                return item.Item;
            });

            values = filterVersionsByPackage(values, packageName);

            const response = {
                statusCode: 200,
                body: JSON.stringify(values)
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
