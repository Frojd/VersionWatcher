'use strict';

const assert = require('assert');
const helpers = require('./helpers');
const settings = require('../settings');
const node = require('../trackers/node');


describe('Test node tracker', () => {
    beforeEach(function() {
        settings.CUSTOM_DOCUMENT_CLIENT = new helpers.MockedDocumentClient();
    });

    afterEach(function() {
        settings.CUSTOM_DOCUMENT_CLIENT = undefined;
    });

    describe('Test node tracker', function() {
        it('makes sure versions gets inserted into db', function(done) {
            let packageData = {
                "name": "Frojd/Client-Project",
                "version": "0.0.1",
                "description": "## Usage",
                "dependencies": {
                    "react": "^3.2.0",
                    "backbone": "^1.7.0"
                },
                "devDependencies": {
                    "mocha": "^3.2.0",
                    "serverless": "^1.7.0"
                }
            }

            const result = node.handler(helpers.MockedRequest({
                queryStringParameters: {
                    project: 'Frojd/Client-Project',
                },
                body: JSON.stringify(packageData),
            }), null, (error, result) => {
                const tables = settings.CUSTOM_DOCUMENT_CLIENT.tables;
                const table = tables['VersionWatcher'];

                assert.equal(result.statusCode, 200);
                assert.equal(table.length, 1);

                assert.equal(table[0].project, 'Frojd/Client-Project');
                assert.equal(table[0].version, '0.0.1');
                assert.equal(table[0].label, 'node');
                assert.equal(table[0].packages.length, 4);
                assert.equal(table[0].packages[3].name, 'serverless');

                done();
            });
        });
    });
});
