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

async function updateItemStats(shortLivedToken, boardId, itemId, columnValueUrlVal, columnIdView, columnIdLike, columnIdDislike)
{
  let columnValues;

  // verify
  if(columnValueUrlVal == '')
  {
    columnValues = JSON.stringify(`{"${columnIdView}":"", "${columnIdLike}":"", "${columnIdDislike}":""}`);

    await mondayService.changeMultipleColumnValues(shortLivedToken, boardId, itemId, columnValues);

    return true;
  }

  // get youtube ID
  const youtubeVideoId = baseService.getYoutubeId(columnValueUrlVal);

  // verification
  if(youtubeVideoId == '') return true;

  // call youtube API
  const webpageData = await callYoutubeAPI(youtubeVideoId);

  // update
  if(webpageData.viewCount == null) return false;

  // update column value
  columnValues = JSON.stringify(`{"${columnIdView}":"${webpageData.viewCount}", "${columnIdLike}":"${webpageData.likeCount}", "${columnIdDislike}":"${webpageData.dislikeCount}"}`);

  // update
  await mondayService.changeMultipleColumnValues(shortLivedToken, boardId, itemId, columnValues);

  return true;
}

async function updateItem(req, res) {
  const { shortLivedToken } = req.session;

  const {
    payload: {
      inboundFieldValues: {
        boardId, itemId, columnIdView, columnIdLike, columnIdDislike
      }
    }
  } = req.body;

  // value URL
  const columnValueUrlVal = req.body.payload.inboundFieldValues.columnValueUrl ? req.body.payload.inboundFieldValues.columnValueUrl.value : '';

  await updateItemStats(shortLivedToken, boardId, itemId, columnValueUrlVal, columnIdView, columnIdLike, columnIdDislike)

  return res.status(200).send({ result: 'Ok!' });
}


async function updateBoard(req, res) {
  const { shortLivedToken } = req.session;
  let columnValOne;
  let itemId, columnValueUrlVal

  const {
    payload: {
      inboundFieldValues: {
        boardId,  columnIdUrl, columnIdView, columnIdLike, columnIdDislike
      }
    }
  } = req.body;

  // get element items of the boards
  const columnsValues = await mondayService.getColumnsValuesColumn(shortLivedToken, boardId, columnIdUrl);

  for(columnsKey in columnsValues)
  {
    columnValOne      = columnsValues[columnsKey]

    // values
    itemId            = columnValOne.id
    columnValueUrlVal = JSON.parse(columnValOne.column_values[0].value)

    // exists
    if(columnValueUrlVal != null)
    {
      // update
      await updateItemStats(shortLivedToken, boardId, itemId, columnValueUrlVal, columnIdView, columnIdLike, columnIdDislike)
    }
  }

  return res.status(200).send({ result: 'Ok!' });
}


module.exports = {
  getFieldDefs,
  updateItem,
  updateBoard
};
