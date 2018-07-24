// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
/* jshint node: true */

'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

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
       intentMap.set('energy', require('./intent-handlers/energy'));
       intentMap.set('default-supplements', require('./intent-handlers/default-supplements'));

       agent.handleRequest(intentMap);
});
