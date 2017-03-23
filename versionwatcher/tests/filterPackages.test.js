'use strict';

const assert = require('assert');
const filterVersionsByPackage = require('../helpers').filterVersionsByPackage


describe('Test result endpoints', () => {
    it('filters stable releases', function(done) {
        let items;
        const versions = [
            {
                packages: [
                    {
                        "name": "wp-total-hacks",
                        "version": "2.0.1"
                    },
                    {
                        "name": "wordpress",
                        "version": "4.7.0"
                    }
                ]
            }
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
