'use strict';

const settings = require('../settings');

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
