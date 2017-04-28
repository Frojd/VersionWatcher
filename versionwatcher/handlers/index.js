const stableHandler = require('./result').stableHandler;
const node = require('./trackers/node').handler;
const wp = require('./trackers/wp').handler;
const python = require('./trackers/python').handler;

module.exports = {
    stableHandler,
    node,
    wp,
    python,
};
