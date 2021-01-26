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
    { id: 'views', title: 'Views', outboundType: 'numeric', inboundTypes: ['numeric'] },
    { id: 'likes', title: 'Likes', outboundType: 'numeric', inboundTypes: ['numeric'] },
    { id: 'unlikes', title: 'Unlikes', outboundType: 'numeric', inboundTypes: ['numeric']  },
  ]);
}

function subscribeStatistic(req, res) {
  console.log('subscribeScheduled', JSON.stringify(req.body));
  const {
    payload: {
      inputFields: {
        dateTriggerConfig: { offset, hour, utcDaysDiff, timezone },
      },
      webhookUrl,
    },
  } = req.body;


  const intervalId =  1;

  return res.status(200).send({ webhookId: intervalId });
}

function unsubscribeStatistic(req, res) {
  console.log('unsubscribeStatistic', JSON.stringify(req.body));

  const {
    payload: { webhookId },
  } = req.body;

  baseService.removeStatTrigger(webhookId);

  return res.status(200).send({ result: 'Thanks for stopping me!' });
}

module.exports = {
  updateStatistic,
  getFieldDefs,
  subscribeStatistic,
  unsubscribeStatistic,
};
