/* jshint node: true */
'use strict';


const admin = require('firebase-admin');
const build = require('../lib/build-responses');

//Todo: get rich responses to work.
function buildRichPayload (data, requestedInfo){
       return {
              expectUserResponse: false,
              isSsml : false,
              noInputPrompts : [],
              richResponse: {
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


module.exports = (agent) => {
       let conv = agent.conv();
       const params = agent.parameters;
       const products =  admin.database().ref('products');
       const product = params.megafoodProduct;
       const requestedInfo = params.productInfo;
       const spokenProduct = params.megafoodProduct.original;

       let data = {};
       console.log('fetching info in Product Index: '+ product + ", to retrieve it's "+requestedInfo);

       const filter = "&filterByFormula=%7BProduct%20Index%7D%3D%22" + product + "%22";

       const hasScreen = conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT'); // Determine surface screen capability.

       return new Promise((resolve, reject)=>{

              //products.child(product).once('value').then(snap => {
              build.airtableGetProductInfo('apparAnxxgPKNtgws','Master%20Products', filter).then(snap => {
                     //data = snap.val();
                     data = snap.records[0].fields;
                     console.log(JSON.stringify(data,null,2));
                     if(conv.user.storage.product === undefined){
                            conv.user.storage.product = data;
                            conv.user.storage.product = data;
                     }
                     if (agent.requestSource === 'ACTIONS_ON_GOOGLE') {
                            console.log(requestedInfo + '<<<<----- Requested info');
                            if(!requestedInfo){
                                   console.log('prompting requested Info');
                                   conv.ask('What would you like to know about ' + data['Product Name']+'? ');
                            } else {
                                   let ssml =    '<speak><p>'+data['Product Name']+'\'s  '+ requestedInfo + ' is: <break time="500ms"/> '+ data[requestedInfo]+'</p>'+
                                          '<break time="1000ms"/> I can also help you reach your wellness goals; just tell me  what they are and I will point you to our supplements.' +
                                          '<break time="700ms"/> or you can say goodbye to finish our conversation.</speak>';

                                   conv.ask(ssml);
                            }


                            /*if(hasScreen){
                                   let payload = buildRichPayload(data,requestedInfo);
                                   console.log(JSON.stringify(payload,null,3));
                                   agent.add(new Payload('ACTIONS_ON_GOOGLE', payload));
                                   return resolve();
                            } if (!hasScreen){
                                   console.log('user does not have a screen');
                                   conv.close(data[requestedInfo]);
                                   agent.add(conv);
                                   return resolve();
                            }*/
                             agent.add(conv);
                             return resolve();
                     } else {
                            conv.close("Sorry, we don't support this platform at this time.");
                            agent.add(conv); // Add Actions on Google library responses to your agent's response
                            return resolve();
                     }

              }).catch(err=>{
                     console.error(new Error(err + 'There was an error on the airtable database query.'));
                     return reject();
              });
       });
};