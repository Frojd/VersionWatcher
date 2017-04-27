'use strict';

const assert = require('assert');
const helpers = require('./helpers');
const settings = require('../settings');
const node = require('../handlers/trackers/node');


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
                    version: 'v1.0.0',
                    project: 'Frojd/Client-Project',
                    branch: 'develop',
                    commit: '173a23d132f21',
                },
                body: JSON.stringify(packageData),
            }), null, (error, result) => {
                const tables = settings.CUSTOM_DOCUMENT_CLIENT.tables;
                const table = settings.TABLE_VERSION;

                assert.equal(result.statusCode, 200);
                assert.equal(table.length, 1);

                assert.equal(table[0].project, 'Frojd/Client-Project');
                assert.equal(table[0].version, 'v1.0.0');
                assert.equal(table[0].branch, 'develop');
                assert.equal(table[0].commit, '173a23d132f21');
                assert.equal(table[0].label, 'node');
                assert.equal(table[0].packages.length, 4);
                assert.equal(table[0].packages[3].name, 'serverless');

                done();
            });
        });

        it('makes sure stable gets created', function(done) {
            let packageData = {
                "name": "Frojd/Client-Project",
                "version": "0.0.1",
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
                    version: 'v1.0.0',
                    project: 'Frojd/Client-Project',
                    branch: 'master',
                    commit: 'a173a23d132f21',
                },
                body: JSON.stringify(packageData),
            }), null, (error, result) => {
                const tables = settings.CUSTOM_DOCUMENT_CLIENT.tables;
                const stableTable = settings.TABLE_STABLE;
                const packagesTable = settings.TABLE_PACKAGE;
                const table = settings.TABLE_VERSION;

                assert.equal(result.statusCode, 200);
                assert.equal(stableTable.length, 1);

                assert.equal(stableTable[0].version, 'v1.0.0');

                assert.equal(table[0].project, 'Frojd/Client-Project');
                assert.equal(table[0].version, 'v1.0.0');
                assert.equal(table[0].branch, 'master');
                assert.equal(table[0].commit, 'a173a23d132f21');
                assert.equal(table[0].label, 'node');
                assert.equal(table[0].packages.length, 4);
                assert.equal(table[0].packages[3].name, 'serverless');

                assert.equal(packagesTable.length, 4);
                assert.equal(packagesTable[0].project_version,
                    'Frojd/Client-Project:v1.0.0');
                assert.equal(packagesTable[0].package_version, 'react:^3.2.0');

                done();
            });
        });
    });
});
