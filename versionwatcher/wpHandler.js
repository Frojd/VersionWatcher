'use strict';

function trackWP(event, context, callback) {
    const wpVersion = event.queryStringParameters.wpversion;
    const project = event.queryStringParameters.project;
    const release = event.queryStringParameters.release;

    let pluginList = JSON.parse(event.body);

    pluginList = pluginList.map((item) => {
        return {name: item.name, version: item.version};
    });

    pluginList.push({
        name: 'wordpress',
        version: wpVersion,
    });

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Go Serverless v1.0! Your function executed successfully!',
            params: {
                wpVersion: wpVersion,
                project: project,
                release: release,
            },
            result: pluginList,
            input: event,
        }),
    };

    callback(null, response);
};


module.exports.trackWP = trackWP;
