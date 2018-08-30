/* jshint node: true */
'use strict';

const build = require('../lib/build-responses');


module.exports = (agent) => {
       let conv = agent.conv();
       conv.user.storage.products = undefined;
       conv.user.storage.index = undefined;

       return new Promise((resolve, reject)=>{
              build.initialAir(agent, 'BoneHealth')
                     .then(res=>{
                            resolve(res);
                     });
       });
};