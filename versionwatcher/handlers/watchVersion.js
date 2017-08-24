const request = require('request');
const R = require('ramda');

const filterVersionsByPackage = require('../helpers').filterVersionsByPackage;
const config = require('../config');
const getSettings = require('../settings').getSettings;
const getDocumentClient = require('../db').getDocumentClient;
const getDoc = require('../db').getDoc;
const stableReleases = require('../helpers').stableReleases;

const VERSIONS_URL = 'https://api.wordpress.org/core/version-check/1.7/';


function loadOffers(url) {
    return new Promise((resolve, reject) => {
        request.get(url, (err, response, body) => {
            if (err || response.statusCode !== 200) {
                return reject(err || response.statusCode);
            }

            body = JSON.parse(body);
            resolve(body.offers);
        })
    });
}

function latestVersion() {
    return new Promise((resolve, reject) => {
        loadOffers(VERSIONS_URL)
            .then(parseVersions)
            .then(R.head)
            .then(resolve);
    });
}

function parseVersions(offers) {
    return offers.map((item) => item.version);
}

function buildResponse(statusCode, body) {
    return {
        statusCode,
        body: JSON.stringify(body)
    }
}

const responseOk = R.curryN(2, buildResponse)(200);
const responseError = R.curryN(2, buildResponse)(200);

const getVersion = R.curryN(2, getDoc)({
    TableName: getSettings().TABLE_VERSION
});

function watchHandler(event, context, callback) {
    const docClient = getDocumentClient();

    //latestVersion().then((version) => {
        //callback(null, buildResponse({version: version}));
    //});

    stableReleases(docClient)
        .then(R.prop('Items'))
        .then(R.filter(
            R.propEq('branch', 'master'))
        )
        .then(R.map(
            R.pick(['project', 'version'])
        ))
        .then(R.map(getVersion))
        .then((promises) => Promise.all(promises))
        .then(R.map(R.prop('Item')))
        .then((versions) => {
            versions = filterVersionsByPackage(versions, 'wordpress:');
            callback(null, responseOk({items: versions}));
        })
        .catch((reason) => {
            callback(null, responseError({data: reason}));
        });
}

module.exports = {
    watchHandler,
};
