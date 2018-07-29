/* jshint node: true */
'use strict';


const admin = require('firebase-admin');

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
       let data = {};


       const hasScreen = conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT'); // Determine surface screen capability.

       return new Promise((resolve, reject)=>{

              products.child(product).once('value').then(snap => {
                     data = snap.val();
                     if(conv.data.product === undefined){
                            conv.data.product = data;
                     }
                     if (agent.requestSource === 'ACTIONS_ON_GOOGLE') {

                            let ssml =    '<speak><p>'+data['Product Name']+'\'s  '+ requestedInfo + ' is:'+ data[requestedInfo]+'</p>'+
                                          '<break time="1000ms"/> I can also help you reach your wellness goals; just tell me  what they are and I will point you to our supplements.' +
                                          '<break time="700ms"/> or you can say goodbye to finish our conversation.</speak>';

                            conv.ask(ssml);
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
                     console.error(new Error(err + 'There was an error on the firebase database query.'));
                     return reject();
              });
       });
};