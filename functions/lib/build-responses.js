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
