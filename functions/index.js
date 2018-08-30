// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
/* jshint node: true */

'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const admin = require('firebase-admin');

admin.initializeApp();


process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements


/***
 *  Creates endpoint for fullfilment for Google Assistant.
 *
 * @type {HttpsFunction}
 */

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {

       const agent = new WebhookClient({request, response});


       console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
       console.log('Dialogflow Request body: ' + JSON.stringify(request.body, null, '\t'));



       // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
       // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

       // Run the proper function handler based on the matched Dialogflow intent name


       let intentMap = new Map();

       intentMap.set('beauty-skin', require('./intent-handlers/beauty-skin'));
       intentMap.set('beauty-skin-next', require('./intent-handlers/next'));
       intentMap.set('beauty-skin-previous', require('./intent-handlers/previous'));

       intentMap.set('bone-health', require('./intent-handlers/bone-health'));
       intentMap.set('bone-health-next', require('./intent-handlers/next'));
       intentMap.set('bone-health-previous', require('./intent-handlers/previous'));

       intentMap.set('digestive', require('./intent-handlers/digestive'));
       intentMap.set('digestive-next', require('./intent-handlers/next'));
       intentMap.set('digestive-previous', require('./intent-handlers/previous'));

       intentMap.set('healthy-aging', require('./intent-handlers/healthy-aging'));
       intentMap.set('healthy-aging-next', require('./intent-handlers/next'));
       intentMap.set('healthy-aging-previous', require('./intent-handlers/previous'));

       intentMap.set('immune', require('./intent-handlers/immune'));
       intentMap.set('immune-next', require('./intent-handlers/next'));
       intentMap.set('immune-previous', require('./intent-handlers/previous'));

       intentMap.set('energy', require('./intent-handlers/energy'));
       intentMap.set('energy-next', require('./intent-handlers/next'));
       intentMap.set('energy-previous', require('./intent-handlers/previous'));

       intentMap.set('kids-health', require('./intent-handlers/kids-health'));
       intentMap.set('kids-health-next', require('./intent-handlers/next'));
       intentMap.set('kids-health-previous', require('./intent-handlers/previous'));

       intentMap.set('prenatal-postnatal', require('./intent-handlers/prenatal-postnatal'));
       intentMap.set('prenatal-postnatal-next', require('./intent-handlers/next'));
       intentMap.set('prenatal-postnatal-previous', require('./intent-handlers/previous'));

       intentMap.set('product-info', require('./intent-handlers/product-info'));

       intentMap.set('sleep-stress', require('./intent-handlers/sleep-stress'));
       intentMap.set('sleep-stress-next', require('./intent-handlers/next'));
       intentMap.set('sleep-stress-previous', require('./intent-handlers/previous'));

       intentMap.set('sport', require('./intent-handlers/sport'));
       intentMap.set('sport-next', require('./intent-handlers/next'));
       intentMap.set('sport-previous', require('./intent-handlers/previous'));

       intentMap.set('default-supplements', require('./intent-handlers/default-supplements'));

       agent.handleRequest(intentMap);
});
