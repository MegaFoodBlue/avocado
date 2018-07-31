/* jshint node: true */
'use strict';

const {Card, Suggestion} = require('dialogflow-fulfillment');

module.exports = (agent) =>{
       let conv = agent.conv(); // Get Actions on Google library conv instance
       const hasScreen =
              conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT');
       const hasAudio =
              conv.surface.capabilities.has('actions.capability.AUDIO_OUTPUT');
       const hasMediaPlayback =
              conv.surface.capabilities.has('actions.capability.MEDIA_RESPONSE_AUDIO');
       const hasWebBrowser =
              conv.surface.capabilities.has('actions.capability.WEB_BROWSER');
       console.log(hasScreen);

       conv.ask('<speak>\n' +
              '  There’s a lot to love about Megafood\'s vitamins and supplements.' +
              '  Easy-to-digest and formulated with farm fresh ingredients, they deliver optimal nutrition and support an overall sense of wellbeing.'+
              '  In order for me to help you find the right one, please tell me what you want to achieve.<break time="300ms"/>' +
              '  Want to loose weight?' + '  Or have more energy?' +
              '  Or provide proper nourishment to you and your loved ones?\n<break time="700ms"/>' +
              '  Let me know what you want and I can point you to the right supplements.' +
              '</speak>');
       agent.add(conv); // Add Actions on Google library responses to your agent's response
};

