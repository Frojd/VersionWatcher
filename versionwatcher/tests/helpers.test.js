'use strict';

const assert = require('assert');
const helpers = require('../helpers');


describe('Test cors proxy', () => {
    it('Verify stable', function(done) {
        assert.ok(
            !helpers.isStable({
                branch: 'master-ar'
            })
        );

        assert.ok(
            helpers.isStable({
                branch: 'master'
            })
        );

        done();
    });
});
