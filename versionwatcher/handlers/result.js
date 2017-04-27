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

function stableHandler(event, context, callback) {
    let docClient = getDocumentClient();
    let queryStringParameters = event.queryStringParameters || {};
    let project = queryStringParameters.project;
    let branch = queryStringParameters.branch;
    let packageName = queryStringParameters.package;

    stableReleases().then((data) => {
        let releases;
        let items = data.Items;

        if (branch) {
            items = items.filter((item) => {
                return item.branch === branch;
            });
        }

        items = items.sort(function(a, b) {
            if (a.created > b.created) {
                return -1;
            }

            if (a.created < b.created) {
                return 1;
            }

            return 0;
        });

        releases = items.map((item) => {
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
