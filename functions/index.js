// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
/* jshint node: true */

'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const admin = require('firebase-admin');
const Alexa = require('alexa-sdk');
const APP_ID = 'amzn1.ask.skill.2580776c-62c3-4997-8724-178807458af1';
const build = require('./lib/build-responses');

admin.initializeApp();


process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.alexaFirebaseFulfillment = functions.https.onRequest((request, response)=>{
       const body = request.body;
       const req = body.request;
       console.log(req);


       let context = {
              succeed: function (result) {
                     console.log(result);
                     response.json(result);
              },
              fail:function (error) {
                     console.log(error);
              }
       };

       const alexa = Alexa.handler(body, context);

       const handlers = {
              'LaunchRequest': () => {
                     this.emit('LaunchIntent');
              },

              'LaunchIntent':  () => {
                     this.emit(':ask','Hi! I\'m not a substitute for a medical professional, but I know a lot about health and wellness.' + build.randomWelcome());
                     response.status(200).end();
              },
              'BeautySkin' : ()=> {
                     build.goalsAlexa('beautyAndSkinRich')
                            .then(value => {
                               this.emit(':ask', value);
                            });
              },
              'Unhandled': () => {
                     this.emit(':ask', 'HelloWorld2', 'HelloWorld2');
                     response.status(200).end();
              }
       };

       alexa.registerHandlers(handlers);

       alexa.appId = APP_ID; // APP_ID is your skill id which can be found in the Amazon developer console where you create the skill.
       alexa.execute();

       /*const requestLog = {
         process(handlerInput){
                console.log("REQUEST ENVELOPE = "+ JSON.stringify(handlerInput.requestEnvelope));
                return;
         }
       };

       const EmptyHandler = {
              canHandle(handlerInput) {
                     return false;
              },
              handle(handlerInput, error) {
                     return handlerInput.responseBuilder
                            .speak()
                            .reprompt()
                            .getResponse();
              }
       };

       const LaunchRequestHandler = {
              canHandle(handlerInput){
                     return handlerInput.requestEnvelope.request.type === "LaunchRequest";
              },
              handle(handlerInput, error){
                     console.log("IN LAUNCH REQUEST");
                     return handlerInput.responseBuilder
                            .speak("Hi! I\\'m not a substitute for a medical professional, but I know a lot about health and wellness." + build.randomWelcome())
                            .reprompt(build.randomWelcome())
                            .getResponse();
              },
       };

       const ErrorHandler = {
              canHandle(){
                     return true;
              },
              handle(handlerInput, error){
                     console.log("Error Handled: "+ JSON.stringify(error.message));
                     console.log("handlerInput: "+ JSON.stringify(handlerInput));
                     return handlerInput.responseBuilder
                            .speak("Sorry, I can\'t understand the command. Please try again")
                            .getResponse();
              },
       };

       const BeautySkinHandler = {
              canHandle(handlerInput){
                     return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
                            handlerInput.requestEnvelope.request.intent.name === "BeautySkin";
              },
              handle(handlerInput, error) {
                     console.log('IN BEAUTY SKIN HANDLER');
                     build.goalsAlexa('beautyAndSkinRich')
                            .then(value => {
                                   console.log(value);
                                   console.log(typeof value);
                                   return handlerInput.responseBuilder
                                          .speak(value);
                            });
              }
              };

       const alexa = Alexa.SkillBuilders.custom()
              .addRequestHandler(
                     LaunchRequestHandler,
                     BeautySkinHandler
              )
              .addRequestInterceptors(requestLog)
              .addErrorHandler(ErrorHandler);

              alexa.invoke(body)
                     .then(function(responseBody) {
                            response.json(responseBody);
                            response.status(200).end();
                     })
                     .catch(function(error) {
                            console.log(error);
                            response.status(500).send('Error during the request');
                     });*/
});




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

       intentMap.set('kids-health', require('./intent-handlers/kids-health'));
       intentMap.set('kids-health-next', require('./intent-handlers/kids-health-next'));
       intentMap.set('kids-health-previous', require('./intent-handlers/kids-health-previous'));

       intentMap.set('prenatal-postnatal', require('./intent-handlers/prenatal-postnatal'));
       intentMap.set('prenatal-postnatal-next', require('./intent-handlers/prenatal-postnatal-next'));
       intentMap.set('prenatal-postnatal-previous', require('./intent-handlers/prenatal-postnatal-previous'));

       intentMap.set('product-info', require('./intent-handlers/product-info'));

       intentMap.set('sleep-stress', require('./intent-handlers/sleep-stress'));
       intentMap.set('sleep-stress-next', require('./intent-handlers/sleep-stress-next'));
       intentMap.set('sleep-stress-previous', require('./intent-handlers/sleep-stress-previous'));

       intentMap.set('sport', require('./intent-handlers/sport'));
       intentMap.set('sport-next', require('./intent-handlers/sport-next'));
       intentMap.set('sport-previous', require('./intent-handlers/sport-previous'));

       intentMap.set('default-supplements', require('./intent-handlers/default-supplements'));

       agent.handleRequest(intentMap);
});
