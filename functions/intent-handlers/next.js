/* jshint node: true */
'use strict';

const build = require('../lib/build-responses');


module.exports = (agent) => {
       build.next(agent);
};