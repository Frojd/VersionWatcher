'use strict';

const settings = require('./settings');

function getDocumentClient() {
    if (settings.CUSTOM_DOCUMENT_CLIENT) {
        return settings.CUSTOM_DOCUMENT_CLIENT;
    }

    const AWS = require('aws-sdk');
    return new AWS.DynamoDB.DocumentClient();
}

function getDoc(config, params) {
    const docClient = getDocumentClient();
    const options = Object.assign({}, config, { Key: params});

    return new Promise(
        (resolve, reject) => {
            docClient.get(options, function(err, data) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        }
    );
}

function putDoc(config, item) {
    const docClient = getDocumentClient();
    const model = Object.assign({}, config, { Item: item });

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
    getDocumentClient,
    getDoc,
    putDoc,
}
