var assert = require('assert');

describe('Test phpHandler', function() {
    it('should format plugin list to accepted format', function() {
        const listFormat = [
            {
                "name": "dynamic-hostname",
                "status": "active",
                "update": "none",
                "version": "0.4.2"
            },
            {
                "name": "tinymce-templates",
                "status": "active",
                "update": "none",
                "version": "4.4.3"
            },
            {
                "name": "wp-multibyte-patch",
                "status": "active",
                "update": "none",
                "version": "2.4"
            },
            {
                "name": "wp-total-hacks",
                "status": "active",
                "update": "none",
                "version": "2.0.1"
            }
        ];

        let formattedObject = {};

        formattedList = listFormat.map((item) => {
            return {name: item.name, version: item.version};
        });

        console.log(formattedList);

        assert.equal(-1, [1,2,3].indexOf(4));
    });
});
