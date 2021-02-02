const baseService = require('../services/base-service');
const request = require('superagent');
const mondayService = require('../services/monday-service');

function getFieldDefs(req, res) {

  return res.status(200).send([

    { id: 'url', title: 'URL', outboundType: 'text', inboundTypes: ['text'] },
    { id: 'viewCount', title: 'View count', outboundType: 'numeric', inboundTypes: ['numeric'] },
    { id: 'likeCount', title: 'Like count', outboundType: 'numeric', inboundTypes: ['numeric'] },
    { id: 'unlikeCount', title: 'Unlike count', outboundType: 'numeric', inboundTypes: ['numeric']  },
  ]);
}

// https://www.codepedia.org/ama/how-to-call-youtube-api-from-nodejs-example
async function callYoutubeAPI(youtubeVideoId) {

  const response = await request
    .get('https://www.googleapis.com/youtube/v3/videos')
    .query({id: youtubeVideoId})
    .query({key: process.env.YOUTUBE_API_KEY || "change-me-with-a-valid-youtube-key-if-you-need-me"}) //used only when saving youtube videos
    .query({part: 'statistics'});

  const webpageData = response.body.items[0].statistics;

  return webpageData;
}

async function  updateColumns(webpageData) {
  // update
  if(!webpageData.viewCount) return;

  await mondayService.changeColumnValue(shortLivedToken, boardId, itemId, columnId, columnValue);
}
 
async function updateFields(req, res) {
  const { shortLivedToken } = req.session;
  let columnValues;

  const {
    payload: {
      inboundFieldValues: {
        boardId, itemId, columnIdView, columnIdLike, columnIdDislike
      }
    }
  } = req.body;

  // value URL
  const columnValueUrlVal = req.body.payload.inboundFieldValues.columnValueUrl ? req.body.payload.inboundFieldValues.columnValueUrl.value : '';

  // verify
  if(columnValueUrlVal == '')
  {
    columnValues = JSON.stringify(`{"${columnIdView}":"", "${columnIdLike}":"", "${columnIdDislike}":""}`);

    await mondayService.changeMultipleColumnValues(shortLivedToken, boardId, itemId, columnValues);

    return res.status(200).send({ result: 'Ok!' });
  }

  // get youtube ID
  const youtubeVideoId = baseService.getYoutubeId(columnValueUrlVal);

  // verification
  if(youtubeVideoId == '') return res.status(200).send({ result: 'Ok!' });

  // call youtube API
  const webpageData = await callYoutubeAPI(youtubeVideoId);

  // update
  if(webpageData.viewCount == null) return res.status(200).send({ result: 'NOk!' });

  // update column value
  columnValues = JSON.stringify(`{"${columnIdView}":"${webpageData.viewCount}", "${columnIdLike}":"${webpageData.likeCount}", "${columnIdDislike}":"${webpageData.dislikeCount}"}`);

  // update
  await mondayService.changeMultipleColumnValues(shortLivedToken, boardId, itemId, columnValues);

  return res.status(200).send({ result: 'Ok!' });
}



module.exports = {
  getFieldDefs,
  updateFields
};
