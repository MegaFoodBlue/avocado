/* jshint node: true */
'use strict';

const {Card, Suggestion} = require('dialogflow-fulfillment');

module.exports = (agent) =>{
       let conv = agent.conv(); // Get Actions on Google library conv instance
       conv.ask('There’s a lot to love about Megafood\'s vitamins and supplements. Easy-to-digest and formulated with farm fresh ingredients, they deliver optimal nutrition and support an overall sense of wellbeing.  In order for me to recommend the right one, please tell me what you want to achieve.  Want to loose weight?  have more energy? or provide proper nourishment to you and your loved ones, let me know and I can point you to our supplements.'); // Use Actions on Google library
       agent.add(conv); // Add Actions on Google library responses to your agent's response
};