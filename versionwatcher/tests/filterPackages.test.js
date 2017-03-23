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

        items = filterVersionsByPackage(versions);
        assert.equal(items.length, 1);

        items = filterVersionsByPackage(versions, 'yoast');
        assert.equal(items.length, 0);

        items = filterVersionsByPackage(versions, 'wordpress');
        assert.equal(items.length, 1);

        items = filterVersionsByPackage(versions, 'wordpress:');
        assert.equal(items.length, 1);

        items = filterVersionsByPackage(versions, 'wordpress:*');
        assert.equal(items.length, 1);

        items = filterVersionsByPackage(versions, 'wordpress:5*');
        assert.equal(items.length, 0);

        items = filterVersionsByPackage(versions, 'wordpress:4*');
        assert.equal(items.length, 1);

        items = filterVersionsByPackage(versions, 'wordpress:4.5*');
        assert.equal(items.length, 0);

        done();
    });
});
