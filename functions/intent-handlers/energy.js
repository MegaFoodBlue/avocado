/* jshint node: true */
'use strict';

const build = require('../lib/build-responses');
const rich = require('../lib/rich-responses');

module.exports = (agent) => {
       let conv = agent.conv();
       conv.data.products = undefined;
       conv.data.index = undefined;
       return new Promise((resolve, reject)=>{
              rich.testAirtable('Energy')
                     .then(value => {
                            build.initial(agent, 'energyRich');
                            resolve();
                     });
       });
};