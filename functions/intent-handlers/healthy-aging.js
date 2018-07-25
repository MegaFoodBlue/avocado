/* jshint node: true */
'use strict';

const build = require('../lib/build-responses');


module.exports = (agent) => {
       let conv = agent.conv();

       conv.data.products = undefined;
       conv.data.index = undefined;
       build.initial(agent, 'healthyAging');
};