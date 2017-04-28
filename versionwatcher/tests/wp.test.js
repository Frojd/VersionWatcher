'use strict';

const assert = require('assert');
const helpers = require('./helpers');
const config = require('../config');
const getSettings = require('../settings').getSettings;
const wp = require('../handlers/trackers/wp');


describe('Test wp tracker', () => {
    beforeEach(function() {
        config.CUSTOM_DOCUMENT_CLIENT = new helpers.MockedDocumentClient();
    });

    afterEach(function() {
        config.CUSTOM_DOCUMENT_CLIENT = undefined;
    });

    describe('Test pip parsing', function() {
        it('validates wp data parsing', function(done) {
            let plugins = [
                {
                    "name": "dynamic-hostname",
                    "status": "active",
                    "update": "none",
                    "version": "0.4.2"
                },
                {
                    "name": "wp-total-hacks",
                    "status": "active",
                    "update": "none",
                    "version": "2.0.1"
                },
                {
                    "name":"force-locale-on-specific-pages",
                    "status": "must-use",
                    "update":"none",
                    "version":""
                }
            ];

            const result = wp.pluginsToPackages(plugins);
            assert.equal(result.length, 2);
            assert.equal(result[1].name, 'wp-total-hacks');
            done();
        });
    });

    describe('Test wp tracker', function() {
        it('makes sure versions gets inserted into db', function(done) {
            let plugins = [
                {
                    "name": "dynamic-hostname",
                    "status": "active",
                    "update": "none",
                    "version": "0.4.2"
                },
                {
                    "name": "wp-total-hacks",
                    "status": "active",
                    "update": "none",
                    "version": "2.0.1"
                }
            ];

            const result = wp.handler(helpers.MockedRequest({
                queryStringParameters: {
                    wpversion: '4.2.0',
                    project: 'Frojd/Client-Project',
                    version: 'v1.0.0',
                    branch: 'master',
                    commit: '173a23d132f21',
                },
                body: JSON.stringify(plugins),
            }), null, (error, result) => {
                const tables = config.CUSTOM_DOCUMENT_CLIENT.tables;
                const table = tables[getSettings().TABLE_VERSION];

                assert.equal(result.statusCode, 200);
                assert.equal(table.length, 1);

                assert.equal(table[0].project, 'Frojd/Client-Project');
                assert.equal(table[0].version, 'v1.0.0');
                assert.equal(table[0].label, 'wordpress');
                assert.equal(table[0].commit, '173a23d132f21');

                assert.ok(table[0].created > 1481466156);

                assert.equal(table[0].branch, 'master');
                assert.equal(table[0].packages.length, 3);
                assert.equal(table[0].packages[2].name, 'wordpress');

                done();
            });
        });
    });
});
