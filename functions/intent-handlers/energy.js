/* jshint node: true */
'use strict';

const {Card, Button, Suggestion} = require('dialogflow-fulfillment');
const rich = require('../lib/rich-responses');
const { BrowseCarousel, Carousel, List, Image } = require('actions-on-google');



function getCards(cards, agent){

       let items = [];
       return new Promise((resolve, reject)=>{
              cards.forEach((item, index) =>{
                     let key = index+1;
                     items.push({
                            title: item.title,
                            description : item.description,
                            image: new Image ({
                                   url: item.image.url,
                                   alt: item.image.accessibilityText
                            }),
                            optionInfo : {
                                   "key": key.toString(),
                                   "synonyms":[
                                          "product "+ index+1,
                                          "item " + index+1
                                   ]
                            }

                     });
                   /*items.push(new BrowseCarouselItem({
                            title: item.title,
                            url: item.openUrlAction.url,
                            description : item.description,
                            image: new Image ({
                                   url: item.image.url,
                                   alt: item.image.accessibilityText
                            }),
                            footer :item.footer
                     }));*/
                     //console.log(JSON.stringify(item, null, '\t'));
                     /*agent.add(new Card({
                                  title: item.title,
                                   imageUrl: item.image.url,
                                   text: item.description,
                                   buttonText: 'view on website',
                                   buttonUrl: item.openUrlAction.url
                                 })
                               );*/
                     /*items.push({ //List
                            "description": item.description,
                            "image": {
                                   "url":  item.image.url,
                                   "accessibilityText": item.image.accessibilityText
                            },
                            "optionInfo": {
                                   "key": index,
                                   "synonyms": [
                                          "product"+index,
                                          "object"+index,
                                          item.title
                                   ]
                            },
                            "title": item.title
                     });*/

              });
              resolve(items);
       });
}

module.exports = (agent) => {
       let conv = agent.conv(); // Get Actions on Google library conv instance
       const hasScreen = conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT');
       let richResponse = rich.getResponses('energyRich');
       const cards = richResponse.items;
       if (hasScreen) {

              getCards(cards, agent).then(function (items) {
                     console.log('items from getCards :' + JSON.stringify(items));
                     conv.ask('Megafood\'s energy-focused supplements are a perfect fit. You can achieve physical and metal wellness with these supplements.');
                     //agent.add(new List ({items: items}));
                     conv.close(new Carousel({
                            items:[items]
                     }));
                     agent.add(conv); // Add Actions on Google library responses to your agent's response
              }).catch(function (err) {
                     console.warn(err);
              });

       } else {
              conv.close("Sorry, you need a screen to see pictures");
              agent.add(conv); // Add Actions on Google library responses to your agent's response
       }

};