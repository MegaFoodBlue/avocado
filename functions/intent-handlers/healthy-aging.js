/* jshint node: true */
'use strict';

const build = require('../lib/build-responses');


module.exports = (agent) => {
       let conv = agent.conv();
       let params = agent.parameters;
       let goal = "";
       conv.user.storage = {}
       if(params.age.amount < 40 && params['user-gender'] === 'male'){
              goal = "MensHealth";
       }
       if(params.age.amount >= 40 && params.age.amount < 55  && params['user-gender'] === 'male'){
              goal = "HealthyAgingMen40";
       }
       if(params.age.amount >= 55 && params['user-gender'] === 'male'){
              goal = "HealthyAgingMen55";
       }
       if(params.age.amount < 40 && params['user-gender'] === 'female'){
              goal = "WomensHealth";
       }
       if(params.age.amount >= 40 && params.age.amount < 55  && params['user-gender'] === 'female'){
              goal = "HealthyAgingWomen40";
       }
       if(params.age.amount >= 55 && params['user-gender'] === 'female'){
              goal = "HealthyAgingWomen55";
       }

       return new Promise((resolve, reject)=>{
              build.initialAir(agent, goal)
                     .then(res=>{
                            resolve(res);
                     });
       });
};