/* jshint node: true */
'use strict';

const {Payload} = require('dialogflow-fulfillment');
const rich = require('../lib/rich-responses');

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

exports.goalsAlexa = (goal)=>{
       return new Promise((resolve, reject)=>{
              let params = {};
              let data = rich.getResponses(goal, params);
              let simpleResponse = data.richResponse.items[0].simpleResponse.textToSpeech;
              let products = data.richResponse.items[1].carouselBrowse.items;
              let length = products.length;
              let index = 0;
              console.log('build single response is running with length of products ----->' + length + 'and index--->' + index);
              if(index === 0){
                     let product = products[index];
                     console.log('case 2' + JSON.stringify(product));
                     resolve(simpleResponse + '. ' + product.description + '. You can say next to hear more.  Or say exit to close our conversation.' );
              } else if(index < length){
                     console.log('case 3 ---->'+length + index);
                     let product = products[index];
                     console.log(JSON.stringify(product));
                     resolve(product.description + '. You can say next to hear more...  Or say exit to close our conversation.');
              } else if(index === length){
                     console.log('case 4 ----> last product');
                     let product = products[index];
                     console.log(JSON.stringify(product));
                     resolve('This was the last product on this category. You can say previous to go back');
              }
              else {
                     console.log('case 5');
                     //resolve(conv);
              }
       });
};

exports.randomWelcome = ()=>{
       let questions = ['Hi! I\'m not a substitute for a medical professional, but I know a lot about health and wellness. What are your health goals?', 'Help me, help you by telling me your age and gender?', 'How can I help you?', 'What are your wanting to upgrade with your health?', 'You can ask me for information on all of Megafood\'s products'];
       let random = getRandom(0, questions.length-1);
       return "<break time='.5s'/>" + questions[random];

};

exports.getSpokenValue = (envelope, slotName) =>
       {
              if (envelope &&
                     envelope.request &&
                     envelope.request.intent &&
                     envelope.request.intent.slots &&
                     envelope.request.intent.slots[slotName] &&
                     envelope.request.intent.slots[slotName].value)
              {
                     return envelope.request.intent.slots[slotName].value;
              }
              else {
                     return undefined;
              }
       };

exports.getResolvedValues = (envelope, slotName) =>
       {
              if (envelope &&
                     envelope.request &&
                     envelope.request.intent &&
                     envelope.request.intent.slots &&
                     envelope.request.intent.slots[slotName] &&
                     envelope.request.intent.slots[slotName].resolutions &&
                     envelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority &&
                     envelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0] &&
                     envelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values)
              {
                     return envelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values;
              }
              else {
                     return undefined;
              }
       };

function getRandom(min, max) {
       return Math.floor(Math.random() * (max-min+1)+min);
}

