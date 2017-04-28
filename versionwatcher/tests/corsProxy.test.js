
'use strict';

const assert = require('assert');

const helpers = require('./helpers');
const corsHandler = require('../handlers/corsproxy').corsHandler;

describe('Test cors proxy', () => {
    describe('Cors proxy handler', function() {
        it('Returns plain text response from url', function(done) {
            let corsUrl = 'https://google.se';
            const result = corsHandler(helpers.MockedRequest({
                queryStringParameters: {
                    corsUrl: corsUrl,
                },
                body: '',
            }), null, (error, result) => {
                assert.equal(result.statusCode, 200);
                assert.notEqual(result.body, null);
                done();
            });
        });
    });
});
