
'use strict';

const assert = require('assert');
const helpers = require('./helpers');
const settings = require('../settings');
const python = require('../handlers/trackers/python');


describe('Test python tracker', () => {
    beforeEach(function() {
        settings.CUSTOM_DOCUMENT_CLIENT = new helpers.MockedDocumentClient();
    });

    afterEach(function() {
        settings.CUSTOM_DOCUMENT_CLIENT = undefined;
    });

    describe('Test pip parsing', function() {
        it('validates pip data parsing', function(done) {
            let packages = `
                awscli==1.11.38
                beautifulsoup4==4.5.1
                botocore==1.5.1
                colorama==0.3.7
                Django==1.10.1
                django-location-field==1.6.1
                django-modelcluster==2.0
                django-taggit==0.18.3
                django-treebeard==4.0.1
                djangorestframework==3.4.7
                docutils==0.13.1
                elasticsearch==5.0.1
                Factory==1.2
                factory-boy==2.7.0
            `;
            const result = python.pipToArray(packages);
            assert.equal(result.length, 14);
            assert.equal(result[13].name, 'factory-boy');
            assert.equal(result[13].version, '2.7.0');
            done();
        });

        it('validates pip data parsing', function(done) {
            let packages = 'awscli==1.11.38\\nbeautifulsoup4==4.5.1\\nbotocore==1.5.1';

            const result = python.pipToArray(packages);
            assert.equal(result.length, 3);
            assert.equal(result[2].name, 'botocore');
            assert.equal(result[2].version, '1.5.1');
            done();
        });
    });

    describe('Test python handler', function() {
        it('makes sure versions gets inserted into db', function(done) {
            let packages = `
                awscli==1.11.38
                beautifulsoup4==4.5.1
                botocore==1.5.1
                colorama==0.3.7
                Django==1.10.1
                django-location-field==1.6.1
                django-modelcluster==2.0
                django-taggit==0.18.3
                django-treebeard==4.0.1
                djangorestframework==3.4.7
                docutils==0.13.1
                elasticsearch==5.0.1
                Factory==1.2
                factory-boy==2.7.0
            `;

            const result = python.handler(helpers.MockedRequest({
                queryStringParameters: {
                    project: 'Frojd/Client-Project',
                    version: 'v1.0.0',
                    branch: 'master',
                    commit: '173a23d132f21',
                    label: 'django',
                },
                body: packages,
            }), null, (error, result) => {
                const tables = settings.CUSTOM_DOCUMENT_CLIENT.tables;
                const table = tables['VersionWatcherVersion'];

                assert.equal(result.statusCode, 200);
                assert.equal(table.length, 1);

                assert.equal(table[0].project, 'Frojd/Client-Project');
                assert.equal(table[0].label, 'django');
                assert.equal(table[0].branch, 'master');
                assert.equal(table[0].commit, '173a23d132f21');
                assert.equal(table[0].packages.length, 14);
                assert.equal(table[0].packages[13].name, 'factory-boy');

                done();
            });
        });
    });
});
