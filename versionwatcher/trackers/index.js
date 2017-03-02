const node = require('./node').handler;
const wp = require('./wp').handler;
const python = require('./python').handler;

module.exports = {
    node,
    wp,
    python,
};
