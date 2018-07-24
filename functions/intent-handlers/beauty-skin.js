/* jshint node: true */
'use strict';

const {Payload} = require('dialogflow-fulfillment');
const rich = require('../lib/rich-responses');



module.exports = (agent) => {
       let conv = agent.conv(); // Get Actions on Google library conv instance
       const hasScreen = conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT'); // Determine surface screen capability.
       let data = rich.getResponses('beautyAndSkinRich'); // Retrieves JSON object from ../lib/rich-responses.js


       if (hasScreen && agent.requestSource === 'ACTIONS_ON_GOOGLE') {
              const googlePayload = {
                     expectUserResponse: false,
                     isSsml : false,
                     noInputPrompts : [],
                     richResponse: data.richResponse,
              };

              agent.add(new Payload('ACTIONS_ON_GOOGLE', googlePayload));

       } else {
              conv.close("Sorry, you need a screen to see pictures");
              agent.add(conv); // Add Actions on Google library responses to your agent's response
       }

};