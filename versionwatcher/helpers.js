'use strict';

const putDoc = require('./db').putDoc;

function addPackage(params) {
    const item = {
        project_version: `${params.project}:${params.version}`,
        package_version: `${params.packageName}:${params.packageVersion}`,
        package: params.packageName,
        version: params.packageVersion,
    };

    return putDoc({ TableName: 'VersionWatcherPackage' }, item);
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

    return putDoc({ TableName: 'VersionWatcherVersion' }, item);
}

function isStable(params) {
    return ['master', 'develop'].indexOf(params.branch) !== -1;
}

function trackStable(params) {
    const item = {
        project_branch: `${params.project}:${params.branch}`,
        version: params.version,
        project: params.project,
        branch: params.branch,
        created: params.created || Math.floor((new Date).getTime()/1000),
    };

    return putDoc({ TableName: 'VersionWatcherStable' }, item);
}

function filterVersionsByPackage(versions, packageName) {
    if (!packageName) {
        return versions;
    }

    let packageInfo = packageName.split(":");
    let name = packageInfo[0];
    let version = packageInfo[1] || '*';

    let pattern = `^${name}\\:${version}$`;
    pattern = pattern.split('*').join('(.*)');
    pattern = pattern.split('-').join('\\-');
    pattern = new RegExp(pattern, 'i');

    versions = versions.filter((version) => {
        var found = false;

        for (let pkg of version.packages) {
            if (found) {
                break;
            }

            let id =`${pkg.name}:${pkg.version}`;
            found = pattern.test(id);
        }

        return found;
    });

    return versions;
}

module.exports = {
    track,
    isStable,
    trackStable,
    filterVersionsByPackage,
}
