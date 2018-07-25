// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
/* jshint node: true */

'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const build = require('./lib/build-responses');


process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
       const requestSource = (request.body.originalRequest);
       console.log(requestSource);
       const agent = new WebhookClient({request, response});


       console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
       console.log('Dialogflow Request body: ' + JSON.stringify(request.body, null, '\t'));



       // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
       // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

       // Run the proper function handler based on the matched Dialogflow intent name


       let intentMap = new Map();

       intentMap.set('beauty-skin', require('./intent-handlers/beauty-skin'));
       intentMap.set('beauty-skin-next', require('./intent-handlers/beauty-skin-next'));
       intentMap.set('beauty-skin-previous', require('./intent-handlers/beauty-skin-previous'));

       intentMap.set('bone-health', require('./intent-handlers/bone-health'));
       intentMap.set('bone-health-next', require('./intent-handlers/bone-health-next'));
       intentMap.set('bone-health-previous', require('./intent-handlers/bone-health-previous'));

       intentMap.set('digestive', require('./intent-handlers/digestive'));
       intentMap.set('digestive-next', require('./intent-handlers/digestive-next'));
       intentMap.set('digestive-previous', require('./intent-handlers/digestive-previous'));

       intentMap.set('healthy-aging', require('./intent-handlers/healthy-aging'));
       intentMap.set('healthy-aging-next', require('./intent-handlers/healthy-aging-next'));
       intentMap.set('healthy-aging-previous', require('./intent-handlers/healthy-aging-previous'));

       intentMap.set('immune', require('./intent-handlers/immune'));
       intentMap.set('immune-next', require('./intent-handlers/immune-next'));
       intentMap.set('immune-previous', require('./intent-handlers/immune-previous'));

       intentMap.set('energy', require('./intent-handlers/energy'));
       intentMap.set('energy-next', require('./intent-handlers/energy-next'));
       intentMap.set('energy-previous', require('./intent-handlers/energy-previous'));

       intentMap.set('default-supplements', require('./intent-handlers/default-supplements'));

       agent.handleRequest(intentMap);
});
