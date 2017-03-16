'use strict';

const put = require('./db').put;

function addPackage(params) {
    const item = {
        project_version: `${params.project}:${params.version}`,
        package_version: `${params.packageName}:${params.packageVersion}`,
        package: params.packageName,
        version: params.packageVersion,
    };

    return put({ TableName: 'VersionWatcherPackage' }, item);
}

function track(params) {
    params.packages.map((pkg) => {
        addPackage({
            project: params.project,
            version: params.version,
            packageName: pkg.name,
            packageVersion: pkg.version,
        });
    });

    const item = {
        project: params.project,
        version: params.version,
        branch: params.branch,
        label: params.label,
        commit: params.commit,
        languages: params.languages,
        packages: params.packages,
        created: params.created || Math.floor((new Date).getTime()/1000),
    }

    // TODO: Rename to VersionWatcherVersion
    return put({ TableName: 'VersionWatcher' }, item);
}

function isStable(params) {
    return params.branch === 'master';
}

function trackStable(params) {
    const item = {
        project_branch: `${params.project}:${params.branch}`,
        version: params.version,
        project: params.project,
        branch: params.branch,
        created: params.created || Math.floor((new Date).getTime()/1000),
    };

    return put({ TableName: 'VersionWatcherStable' }, item);
}

module.exports = {
    track,
    isStable,
    trackStable,
}
