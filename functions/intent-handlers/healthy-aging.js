/* jshint node: true */
'use strict';

const build = require('../lib/build-responses');


module.exports = (agent) => {
       let conv = agent.conv();
       let params = agent.parameters;

       conv.data.products = undefined;
       conv.data.index = undefined;
       console.log(agent.parameters);
       build.initial(agent, 'healthyAging');
};