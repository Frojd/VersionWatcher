"use strict";

const request = require("request");
const R = require("ramda");
const IncomingWebhook = require("@slack/client").IncomingWebhook;

const filterVersionsByPackage = require("../helpers").filterVersionsByPackage;
const buildMatchPattern = require("../helpers").buildMatchPattern;
const config = require("../config");
const getSettings = require("../settings").getSettings;
const getDocumentClient = require("../db").getDocumentClient;
const getDoc = require("../db").getDoc;
const stableReleases = require("../helpers").stableReleases;

const VERSIONS_URL = "https://api.wordpress.org/core/version-check/1.7/";

const watchHandler = (event, context, callback) => {
    loadOutdatedWordpress()
        .then(data => {
            if (!data.versions.length) {
                callback(
                    null,
                    responseOk({
                        versions: data.versions
                    })
                );
                return;
            }

            sendIftttNotification(data.latestVersion, data.versions)
                .then(status => {
                    callback(
                        null,
                        responseOk({
                            versions: data.versions
                        })
                    );
                })
                .catch(reason => {
                    callback(
                        null,
                        responseError({
                            data: reason.toString()
                        })
                    );
                });
        })
        .catch(reason => {
            callback(
                null,
                responseError({
                    data: reason.toString()
                })
            );
        });
};

const loadOutdatedWordpress = () => {
    return new Promise((resolve, reject) => {
        loadLatestWpVersion()
            .then(version => {
                stableReleases(getDocumentClient())
                    .then(parseReleases)
                    .then(R.map(getVersion))
                    .then(promises => Promise.all(promises))
                    .then(R.map(R.prop("Item")))
                    .then(R.partial(filterVersionsByPackage, ["wordpress:"]))
                    .then(
                        R.partial(filterVersionsByPackage, [
                            `!wordpress:${version}`
                        ])
                    )
                    .then(versions => {
                        resolve({ latestVersion: version, versions });
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
};

const loadLatestWpVersion = () => {
    return new Promise((resolve, reject) => {
        loadAllWpVersions(VERSIONS_URL)
            .then(parseVersions)
            .then(R.head)
            .then(resolve);
    });
};

const loadAllWpVersions = url => {
    return new Promise((resolve, reject) => {
        request.get(url, (err, response, body) => {
            if (err || response.statusCode !== 200) {
                return reject(err || response.statusCode);
            }

            body = JSON.parse(body);
            resolve(body.offers);
        });
    });
};

const parseVersions = offers => {
    return offers.map(item => item.version);
};

const buildResponse = (statusCode, body) => {
    return {
        statusCode,
        body: JSON.stringify(body)
    };
};

const responseOk = R.partial(buildResponse, [200]);
const responseError = R.partial(buildResponse, [200]);

const getVersion = R.curryN(2, getDoc)({
    TableName: getSettings().TABLE_VERSION
});

const log = value => {
    console.log(value);
    return value;
};

const parseReleases = R.pipe(
    R.prop("Items"),
    R.filter(R.propEq("branch", "master")),
    R.map(R.pick(["project", "version"]))
);

const getWpVersion = R.pipe(
    R.prop("packages"),
    R.filter(R.propEq("name", "wordpress")),
    R.head,
    R.prop("version")
);

const sendIftttNotification = (latestVersion, versions) => {
    return new Promise((resolve, reject) => {
        const apiKey = getSettings().IFTTT_KEY;
        const url = `https://maker.ifttt.com/trigger/version_watcher/with/key/${apiKey}`;

        let msg = R.map(item => {
            let wpVersion = getWpVersion(item);
            return `- ${item.project} (${wpVersion})`;
        }, versions);
        msg = msg.join("\n");

        const postData = {
            value1: "WordPress",
            value2: msg,
            value3: latestVersion
        };

        request.post(url, { json: postData }, (err, response, body) => {
            if (err || response.statusCode !== 200) {
                return reject(err || response.statusCode);
            }
            return resolve(true);
        });
    });
};

const sendNotification = (loadLatestWpVersion, versions) => {
    return new Promise((resolve, reject) => {
        const webhook = new IncomingWebhook(getSettings().WATCH_WEBHOOK);
        const title =
            "Oh no. I found a couple of sites running an outdated WordPress version:\n";
        let msg = R.map(item => {
            let wpVersion = getWpVersion(item);
            return `- ${item.project} (${wpVersion})`;
        }, versions);
        msg = msg.join("\n");

        msg += `\n\nLatest version is: ${loadLatestWpVersion}`;

        webhook.send(`${title}\n${msg}`, (err, header, statusCode, body) => {
            if (err) {
                return reject(err);
            }
            return resolve(true);
        });
    });
};

module.exports = {
    watchHandler
};
