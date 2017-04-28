'use strict';

const config = require('../config');
const getSettings = require('../settings').getSettings;
const getDocumentClient = require('../db').getDocumentClient;
const getDoc = require('../db').getDoc;
const filterVersionsByPackage = require('../helpers').filterVersionsByPackage;

function stableReleases(params) {
    let docClient = getDocumentClient();

    var params = {
        TableName: getSettings().TABLE_STABLE,
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
            return getDoc({ TableName: getSettings().TABLE_VERSION }, item);
        });

        Promise.all(promises).then((values) => {
            values = values.map((item) => {
                return item.Item;
            });

            values = filterVersionsByPackage(values, packageName);

            const response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
                },
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
