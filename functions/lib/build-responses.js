/* jshint node: true */
'use strict';

const {Payload} = require('dialogflow-fulfillment');
const rich = require('../lib/rich-responses');
const Airtable = require('airtable');
const secret = require('../lib/secret');
const footer = 'This statement has not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure or prevent any disease.';
const base = new Airtable({apiKey: 'keyo49Tl2tr4aROPa'}).base('apparAnxxgPKNtgws');
let items = [];
let payload = {
       "richResponse" :{
              "items" : [
                     {
                            "simpleResponse": {
                            }
                     },
                     {
                            "carouselBrowse" : {
                                   "items" : [{}]
                            }
                     }
              ]
       }
};



exports.initial = (agent, category) => {
       let params = agent.parameters;
       let data = rich.getResponses(category, params); // Retrieves JSON object from ../lib/rich-responses.js
       let simpleResponse = data.richResponse.items[0].simpleResponse.textToSpeech;
       let products = data.richResponse.items[1].carouselBrowse;

       let conv = agent.conv(); // Get Actions on Google library conv instance


       if(conv.data.products === undefined){
              conv.data.products = products.items;
              console.log('products are undefined, setting products to conv data');
       }

       if(conv.data.index === undefined){
              conv.data.index = 0;
       }

       const hasScreen = conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT'); // Determine surface screen capability.

       if (agent.requestSource === 'ACTIONS_ON_GOOGLE') {
              if(hasScreen){
                     const googlePayload = {
                            expectUserResponse: true,
                            isSsml : false,
                            noInputPrompts : [],
                            richResponse: data.richResponse,
                     };

                     googlePayload.richResponse.items[0].simpleResponse.textToSpeech += '... I can also give you information about Megafood\'s products, just tell me what you want to know. Or say goodbye to finish our conversation.' ;

                     agent.add(new Payload('ACTIONS_ON_GOOGLE', googlePayload));
              } if (!hasScreen){
                     console.log('user does not have a screen');
                     conv.ask(simpleResponse);
                     buildSingleResponse(conv.data.products, conv.data.index, conv)
                            .then(function(conversation){
                                   conv.data.index ++;
                                   agent.add(conversation); // Add Actions on Google library responses to your agent's response
                            });

              }
       } else {
              conv.close("Sorry, we don't support this platform at this time.");
              agent.add(conv); // Add Actions on Google library responses to your agent's response
       }

};

exports.initialAir = (agent, category) => {
       return new Promise((resolve => {
              let params = agent.parameters;
              let data = {};
              let conv = agent.conv(); // Get Actions on Google library conv instance
              airtableGetGoals(category)
                     .then(value => {
                        data = value;
                        console.log(JSON.stringify(value,null,'\t'));

                            let simpleResponse = data.richResponse.items[0].simpleResponse.textToSpeech;
                            let products = data.richResponse.items[1].carouselBrowse;

                            if(conv.data.products === undefined){
                                   conv.data.products = products.items;
                                   console.log('products are undefined, setting products to conv data');
                            }
                            if(conv.data.index === undefined){
                                   conv.data.index = 0;
                            }

                            const hasScreen = conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT'); // Determine surface screen capability.

                            if (agent.requestSource === 'ACTIONS_ON_GOOGLE') {
                                   if(hasScreen){
                                          const googlePayload = {
                                                 expectUserResponse: true,
                                                 isSsml : false,
                                                 noInputPrompts : [],
                                                 richResponse: data.richResponse,
                                          };

                                          googlePayload.richResponse.items[0].simpleResponse.textToSpeech += '... I can also give you information about Megafood\'s products, just tell me what you want to know. Or say goodbye to finish our conversation.' ;
                                          resolve();

                                          agent.add(new Payload('ACTIONS_ON_GOOGLE', googlePayload));
                                   } if (!hasScreen){
                                          console.log('user does not have a screen');
                                          conv.ask(simpleResponse);
                                          buildSingleResponse(conv.data.products, conv.data.index, conv)
                                                 .then(function(conversation){
                                                        conv.data.index ++;
                                                        agent.add(conversation); // Add Actions on Google library responses to your agent's response
                                                        resolve();
                                                 });
                                   }
                            } else {
                                   conv.close("Sorry, we don't support this platform at this time.");
                                   agent.add(conv); // Add Actions on Google library responses to your agent's response
                                   resolve();
                            }
                     })
                     .catch(err =>{
                            console.log(err);
                            conv.ask("I could not find products related to this category, please try again.");
                     });
       }));
};

exports.next= (agent) => {

       let conv = agent.conv();

       conv.data.index ++;

       if(conv.data.products !== undefined){
              buildSingleResponse(conv.data.products, conv.data.index, conv)
                     .then(function (conversation) {
                            agent.add(conversation);
                     });
       }
       console.log(conv.data.index);
       console.log(conv.data.products);
};

exports.previous= (agent) => {

       let conv = agent.conv();

       conv.data.index --;

       if(conv.data.products !== undefined){
              buildSingleResponse(conv.data.products, conv.data.index, conv)
                     .then(function (conversation) {
                            agent.add(conversation);
                     });
       }
       console.log(conv.data.index);
       console.log(conv.data.products);
};

exports.randomWelcome = ()=>{
       let questions = ['Hi! I\'m not a substitute for a medical professional, but I know a lot about health and wellness. What are your health goals?', 'Help me, help you by telling me your age and gender?', 'How can I help you?', 'What are your wanting to upgrade with your health?', 'You can ask me for information on all of Megafood\'s products'];
       let random = getRandom(0, questions.length-1);
       return "<break time='.5s'/>" + questions[random];

};

function getRandom(min, max) {
       return Math.floor(Math.random() * (max-min+1)+min);
}

function airtableGetGoals (goal){
       return new Promise((resolve,reject)=>{

              base(goal).select({
                     maxRecords: 15,
                     view: "Grid view"
              }).eachPage(function page(records) {
                     records.forEach(function(record) {
                            if(record.get('title')=== 'General' ){
                                   payload.richResponse.items[0].simpleResponse.textToSpeech = record.get('description');
                            } else {
                                   let description = '';
                                   if (record.get('spoken description')){
                                          description = record.get('spoken description');
                                   } else {
                                          description = record.get('description');
                                   }
                                   let item = {
                                          "title" : record.get('title'),
                                          "description": description,
                                          "footer": footer,
                                          "image" : {
                                                 "url" : record.get('image'),
                                                 "accessibilityText" : record.get('title')
                                          },
                                          "openUrlAction" : {
                                                 "url" : record.get('openUrlAction')
                                          }
                                   };
                                   items.push(item);
                            }
                     });
                     payload.richResponse.items[1].carouselBrowse.items = items;
                     resolve(payload);

              }, function done(err) {
                     if (err) {console.error(err);}
                     reject(err);
              });
       });
}

function buildSingleResponse (products, index, conv){
       return new Promise((resolve,reject)=>{
              let length = products.length;
              console.log('build single response is running with length of products ----->' + length + 'and index--->' + index);
              if(products.length === 0){
                     console.log('case 1');
                     conv.close('There are no products for this category');
                     resolve(conv);
              } else if(index < 0){
                     console.log('case 2');
                     conv.close('There are no products before this one');
                     resolve(conv);
              } else if(index < length){
                     console.log('case 3 ---->'+length + index);
                     let product = products[index];
                     console.log(JSON.stringify(product));
                     conv.ask(product.description + '. You can say next to hear more...  Or say goodbye to close our conversation.');
                     resolve(conv);
              } else if(index === length){
                     console.log('case 4 ----> last product');
                     let product = products[index];
                     console.log(JSON.stringify(product));
                     conv.ask('This was the last product on this category. You can say previous to go back');
                     resolve(conv);
              }
              else {
                     console.log('case 5');
                     resolve(conv);
              }
       });
}