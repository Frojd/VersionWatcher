'use strict';

const config = require('../config');

function MockedRequest(params) {
    return {
        queryStringParameters: params.queryStringParameters || {},
        body: params.body || undefined,
    };
}

class MockedDocumentClient {
    constructor(params) {
        this.tables = {}
    }

    scan(model, callback) {
        callback(null, {
            Items: this.tables[model.TableName],
        });
    }

    query(model, callback) {
        callback(null, {
            Items: this.tables[model.TableName],
        });
    }

    put(model, callback) {
        let table = this.tables[model.TableName] || [];
        table.push(model.Item);
        this.tables[model.TableName] = table;

        callback(null, model);
    }
}

module.exports = {
    MockedRequest: MockedRequest,
    MockedDocumentClient: MockedDocumentClient,
}
