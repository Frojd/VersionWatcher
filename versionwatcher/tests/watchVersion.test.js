'use strict';

const assert = require('assert');
const config = require('../config');
const helpers = require('./helpers');
const getSettings = require('../settings').getSettings;
const watchHandler = require('../handlers/watchVersion').watchHandler;


describe('Test result endpoints', () => {
    beforeEach(function() {
        config.CUSTOM_DOCUMENT_CLIENT = new helpers.MockedDocumentClient();
    });

    afterEach(function() {
        config.CUSTOM_DOCUMENT_CLIENT = undefined;
    });

    it('filters stable releases', function(done) {
        //done();
        
        const result = watchHandler(helpers.MockedRequest({
            queryStringParameters: {
            },
        }), null, (error, result) => {
            assert.equal(result.statusCode, 200);
            assert.notEqual(result.body, null);
            done();
        });
        
    })
});
