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
              '  There’s a lot to love about Megafood\'s vitamins and supplements.\n' +
              '   Easy-to-digest and formulated with farm fresh ingredients, they deliver optimal nutrition and support an overall sense of wellbeing.' +
              '  In order for me to recommend the right one, please tell me what you want to achieve.<break time="300ms"/>\n' +
              '  Want to loose weight?.\n' +
              '  have more energy?.\n' +
              '  or provide proper nourishment to you and your loved ones?\n<break time="700ms"/>' +
              '   let me know and I can point you to our supplements.\n' +
              '</speak>');
       agent.add(conv); // Add Actions on Google library responses to your agent's response
};

