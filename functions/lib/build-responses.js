/* jshint node: true */
'use strict';

const {Payload} = require('dialogflow-fulfillment');
const rich = require('../lib/rich-responses');
const admin = require('firebase-admin');

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
                     conv.ask(product.description + '. You can say next to hear more');
                     resolve(conv);
              } else if(index === length-1){
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

function buildRichPayload (data, requestedInfo){
       return {
              expectUserResponse: true,
              isSsml : false,
              noInputPrompts : [],
              richInitialPrompt: {
                     'items': [
                            {
                                   "simpleResponse": {
                                          "textToSpeech": data[requestedInfo]
                                   }
                            },
                            {
                                   "basicCard" : {
                                          "title": data['Product Name'],
                                          "subtitle": data['Main Claim'],
                                          "formattedText": data[requestedInfo],
                                          "image": {
                                                 'url': {
                                                        "url":data.image,
                                                        "accessibilityText": data['Product Name']
                                                 },
                                                 "buttons": [
                                                        {
                                                               "title": "View on web",
                                                               "openUrlAction": {
                                                                      "url": data.web
                                                               }
                                                        }
                                                 ]
                                          }
                                   }
                            }
                     ]
              },
       };

}

exports.initialFirebase = (agent)=>{
       let conv = agent.conv();
       let params = agent.parameters;
       let products =  admin.database().ref('products');
       let product = params.megafoodProduct;
       let requestedInfo = params.productInfo;
       let data = {};
       const hasScreen = conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT'); // Determine surface screen capability.

       products.child(product).once('value').then(snap => {
              data = snap.val();
              conv.ask('ok! let me get that for you!');
              agent.add(conv);

              if(conv.data.product === undefined){
                     conv.data.product = data;
              }

              if (agent.requestSource === 'ACTIONS_ON_GOOGLE') {
                     if(hasScreen){
                            let payload = buildRichPayload(data,requestedInfo);
                            console.log(JSON.stringify(payload,null,3));
                            agent.add(new Payload('ACTIONS_ON_GOOGLE', payload));
                     } if (!hasScreen){
                            console.log('user does not have a screen');
                            conv.close(data[requestedInfo]);
                            agent.add(conv);
                     }
              } else {
                     conv.close("Sorry, we don't support this platform at this time.");
                     agent.add(conv); // Add Actions on Google library responses to your agent's response
              }

       }).catch(err=>{
              console.error(err);
       });
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
                            expectUserResponse: false,
                            isSsml : false,
                            noInputPrompts : [],
                            richResponse: data.richResponse,
                     };

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
