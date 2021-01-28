const fetch = require('node-fetch');
var fs = require('fs');
var parse = require('csv-parse');

const mondayService = require('../services/monday-service');

const triggers = {};
let nextTriggerId = 1;

class BaseService {

  static getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  static async fetchTest(webhookUrl)
  {
    console.log('fetchTest webhookUrl '+webhookUrl)
    setTimeout(async () => {
    try {
      const body = JSON.stringify({
        trigger:
          {
            outputFields:
            {
              youtubeEntity: {
                url: 'dddd',
                /*viewCount: '2',
                likeCount: '2',
                unlikeCount: '2',*/
              } }
            },
      });

      const tmp = {
        "trigger": {
          "inputFields": { ///values of all output fields, which were configured for your custom trigger
            "youtubeEntity": {
              "url" : "ssss"
            }
          }
        }
      }

      const resp = await fetch(webhookUrl, {
        method: 'POST',
        body,
         headers: {
          authorization: process.env.MONDAY_SIGNING_SECRET,
          contentType: 'application/json',


        },
      });

      const text = await resp.text();

      console.log('Triggeredddd: ', tmp, 'response', text);

      return BaseService.getRandomInt(5000);
    } catch (e) {
      console.error('Oops, trigger failed', e);
    }

  }, 500);

}


}

module.exports = BaseService;
