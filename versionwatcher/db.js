'use strict';

const settings = require('./settings');

function getDocumentClient() {
    if (settings.CUSTOM_DOCUMENT_CLIENT) {
        return settings.CUSTOM_DOCUMENT_CLIENT;
    }

    const AWS = require('aws-sdk');
    return new AWS.DynamoDB.DocumentClient();
}

module.exports = {
    getDocumentClient: getDocumentClient,
}
