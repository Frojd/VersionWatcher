'use strict';

const R = require('ramda');

const putDoc = require('./db').putDoc;
const config = require('./config');
const getSettings = require('./settings').getSettings;


function addPackage(params) {
    const item = {
        project_version: `${params.project}:${params.version}`,
        package_version: `${params.packageName}:${params.packageVersion}`,
        package: params.packageName,
        version: params.packageVersion,
    };

    return putDoc({ TableName: getSettings().TABLE_PACKAGE }, item);
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

    return putDoc({ TableName: getSettings().TABLE_VERSION }, item);
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

    return putDoc({ TableName: getSettings().TABLE_STABLE }, item);
}

const containsPackage = R.curry((status, pattern, version) => {
    const foundItems = R.reduce((acc, c) => {
        acc.push(
            pattern.test(`${c.name}:${c.version}`)
        );
        return acc;
    }, [], version.packages);

    return R.contains(status, foundItems);
});

const inPackages = containsPackage(true);
const notInPackages = R.curry(R.compose(R.not, containsPackage(false)));

function buildMatchPattern(packageName) {
    let packageInfo = packageName.split(":");
    let name = packageInfo[0];
    let version = packageInfo[1] || '*';
    let negate = false;
    let pattern;

    if (name.indexOf('!') === 0) {
        negate = true;
        name = name.substr(1);
    }

    pattern = `${name}\\:${version}`;
    pattern = pattern.split('*').join('(.*)');
    pattern = pattern.split('-').join('\\-');

    if (negate) {
        pattern = `((?!${pattern}).)*`;
    }

    pattern = `^${pattern}$`;
    return new RegExp(pattern, 'i');
}

function filterVersionsByPackage(name, versions) {
    if (!name) {
        return versions;
    }

    const pattern = buildMatchPattern(name);
    const filterFunc = name.startsWith('!') ? notInPackages : inPackages;

    return versions.filter(filterFunc(pattern));
}

function stableReleases(docClient, params) {
    var params = {
        TableName: getSettings().TABLE_STABLE,
    };

    return new Promise(
        (resolve, reject) => {
            docClient.scan(params, function(err, data) {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        }
    );
}

module.exports = {
    track,
    isStable,
    trackStable,
    filterVersionsByPackage,
    stableReleases,
    buildMatchPattern,
}
