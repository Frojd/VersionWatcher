'use strict';

const assert = require('assert');
const filterVersionsByPackage = require('../helpers').filterVersionsByPackage


describe('Test result endpoints', () => {
    it('filters stable releases', function(done) {
        let items;
        const versions = [
            {
                "version": "v1.1.1",
                "languages": "php",
                "branch": "master",
                "label": "wordpress",
                "created": 1490269584,
                "project": "Frojd/Client-Project2",
                "packages": [
                    {
                        "name": "dynamic-hostname",
                        "version": "0.4.2"
                    },
                    {
                        "name": "tinymce-templates",
                        "version": "4.4.3"
                    },
                    {
                        "name": "wp-multibyte-patch",
                        "version": "2.4"
                    },
                    {
                        "name": "wp-total-hacks",
                        "version": "2.0.1"
                    },
                    {
                        "name": "wordpress",
                        "version": "4.7.0"
                    }
                ],
                "commit": "randomrandomrandom"
            },
        ];

        items = filterVersionsByPackage(null, versions);
        assert.equal(items.length, 1);

        items = filterVersionsByPackage('yoast', versions);
        assert.equal(items.length, 0);

        items = filterVersionsByPackage('wordpress', versions);
        assert.equal(items.length, 1);

        items = filterVersionsByPackage('wordpress:', versions);
        assert.equal(items.length, 1);

        items = filterVersionsByPackage('wordpress:*', versions);
        assert.equal(items.length, 1);

        items = filterVersionsByPackage('wordpress:5*', versions);
        assert.equal(items.length, 0);

        items = filterVersionsByPackage('wordpress:4*', versions);
        assert.equal(items.length, 1);

        items = filterVersionsByPackage('wordpress:4.5*', versions);
        assert.equal(items.length, 0);

        items = filterVersionsByPackage('wp-total-hacks', versions);
        assert.equal(items.length, 1);

        done();
    });


    it('filter non-matching package', function(done) {
        let items;
        const versions = [
            {
                "version": "v1.1.1",
                "languages": "php",
                "branch": "master",
                "label": "wordpress",
                "created": 1490269584,
                "project": "Frojd/Client-Project2",
                "packages": [
                    {
                        "name": "wordpress",
                        "version": "4.7.0"
                    }
                ],
                "commit": "randomrandomrandom"
            },
            {
                "version": "v1.1.1",
                "languages": "php",
                "branch": "master",
                "label": "wordpress",
                "created": 1490269584,
                "project": "Frojd/Negated-Project",
                "packages": [
                    {
                        "name": "wordpress",
                        "version": "5.0.0"
                    }
                ],
                "commit": "randomrandomrandom"
            },
            {
                "version": "v1.1.1",
                "languages": "php",
                "branch": "master",
                "label": "wordpress",
                "created": 1490269584,
                "project": "Frojd/Non-Wordpress",
                "packages": [
                    {
                        "name": "django",
                        "version": "1.10.0"
                    }
                ],
                "commit": "randomrandomrandom1"
            },
        ];

        items = filterVersionsByPackage('wordpress:', versions);
        assert.equal(items.length, 2);

        items = filterVersionsByPackage('!wordpress:4.7.0', versions);
        assert.equal(items.length, 2);
        assert.equal(items[0].project, 'Frojd/Negated-Project');

        done();
    });

    it('replicate server bug', function(done) {
        const versions = [
            {
                "version": "v1.1.2",
                "languages": "php",
                "branch": "master",
                "label": "wordpress",
                "created": 1503602479,
                "project": "Frojd/Client-Project4",
                "packages": [
                    {
                        "name": "dynamic-hostname",
                        "version": "0.4.2"
                    },
                    {
                        "name": "tinymce-templates",
                        "version": "4.4.3"
                    },
                    {
                        "name": "wp-multibyte-patch",
                        "version": "2.4"
                    },
                    {
                        "name": "wp-total-hacks",
                        "version": "2.0.1"
                    },
                    {
                        "name": "wordpress",
                        "version": "4.7.3"
                    }
                ],
                "commit": "randomrandomrandom11"
            }
        ];

        let items = filterVersionsByPackage('wordpress:', versions);
        assert.equal(items.length, 1);

        items = filterVersionsByPackage('!wordpress:4.7.3', items);
        assert.equal(items.length, 0);
        done();
    });
});
