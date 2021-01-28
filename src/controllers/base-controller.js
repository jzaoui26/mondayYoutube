const baseService = require('../services/base-service');

function updateStatistic(req, res) {
  console.log('updateEntityStats', JSON.stringify(req.body));



  // @Todo Go to Youtube API and do

  return res.status(200).send({});
}


function getFieldDefs(req, res) {
  console.log('getFieldDefs', JSON.stringify(req.body));

  return res.status(200).send([

    { id: 'url', title: 'URL', outboundType: 'text', inboundTypes: ['text'] },
    /*{ id: 'viewCount', title: 'View count', outboundType: 'numeric', inboundTypes: ['numeric'] },
    { id: 'likeCount', title: 'Like count', outboundType: 'numeric', inboundTypes: ['numeric'] },
    { id: 'unlikeCount', title: 'Unlike count', outboundType: 'numeric', inboundTypes: ['numeric']  },*/
  ]);
}

function subscribeUpdate(req, res) {

  console.log('subscribeUpdate', JSON.stringify(req.body));
  const {
    payload: {
      inputFields: {

      },
      webhookUrl,
    },
  } = req.body;

   console.log('blblbl '+ webhookUrl);

  baseService.fetchTest(webhookUrl);

  const intervalId = baseService.getRandomInt(5000);;


  return res.status(200).send({ webhookId: intervalId });
}

function subscribeUpdate(req, res) {

  console.log('subscribeUpdate', JSON.stringify(req.body));
  const {
    payload: {
      inputFields: {

      },
      webhookUrl,
    },
  } = req.body;

   console.log('blblbl '+ webhookUrl);

  baseService.fetchTest(webhookUrl);

  const intervalId = baseService.getRandomInt(5000);;


  return res.status(200).send({ webhookId: intervalId });
}

function ticketSubscribe(req, res) {

  console.log('ticketSubscribe', JSON.stringify(req.body));
  const {
    payload: {
      inputFields: {

      },
      webhookUrl,
    },
  } = req.body;

  console.log('blblbl '+ webhookUrl);

  baseService.fetchTest(webhookUrl);

  const intervalId = baseService.getRandomInt(5000);;


  return res.status(200).send({ webhookId: intervalId });
}

function unsubscribeUpdate(req, res) {
  console.log('subscribeUpdate', JSON.stringify(req.body));

  const {
    payload: { webhookId },
  } = req.body;


  return res.status(200).send({ result: 'Thanks for stopping me!' });
}


function ticketUnsubscribe(req, res) {
  console.log('subscribeUpdate', JSON.stringify(req.body));

  const {
    payload: { webhookId },
  } = req.body;


  return res.status(200).send({ result: 'Thanks for stopping me!' });
}

function updateStatistic(req, res) {
  console.log('updateStatistic', JSON.stringify(req.body));
  console.log(req.toString());


  return res.status(200).send({ result: 'Thanks for stopping me!' });
}

function updateStatFinal(req, res) {
  console.log('updateStatFinal', JSON.stringify(req.body));
  console.log(req.toString());


  return res.status(200).send({ result: 'Thanks for stopping me!' });
}

function fetchTest() {
  baseService.fetchTest();



}


module.exports = {
  getFieldDefs,
  subscribeUpdate,
  unsubscribeUpdate,
  updateStatistic,
  updateStatFinal,
  ticketSubscribe,
  ticketUnsubscribe,
  fetchTest
};
