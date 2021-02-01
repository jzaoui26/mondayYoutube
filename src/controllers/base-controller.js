const baseService = require('../services/base-service');
const request = require('superagent');
const mondayService = require('../services/monday-service');

function getFieldDefs(req, res) {
  console.log('getFieldDefs', JSON.stringify(req.body));

  return res.status(200).send([

    { id: 'url', title: 'URL', outboundType: 'text', inboundTypes: ['text'] },
    { id: 'viewCount', title: 'View count', outboundType: 'numeric', inboundTypes: ['numeric'] },
    { id: 'likeCount', title: 'Like count', outboundType: 'numeric', inboundTypes: ['numeric'] },
    { id: 'unlikeCount', title: 'Unlike count', outboundType: 'numeric', inboundTypes: ['numeric']  },
  ]);
}

// https://www.codepedia.org/ama/how-to-call-youtube-api-from-nodejs-example

async function callYoutubeAPI(youtubeVideoId) {

   console.log('fjfjfj');
  const response = await request
    .get('https://www.googleapis.com/youtube/v3/videos')
    .query({id: youtubeVideoId})
    .query({key: process.env.YOUTUBE_API_KEY || "change-me-with-a-valid-youtube-key-if-you-need-me"}) //used only when saving youtube videos
    .query({part: 'statistics'});

  console.log('statistics')
  console.log(response.body.items[0].statistics)

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
  console.log('updateFields', JSON.stringify(req.body));

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
    //columnValues = `{"${columnIdView}":"0", "${columnIdLike}":"0", "${columnIdDislike}":"0"}`;

    columnValues = JSON.stringify(`{"${columnIdView}":"", "${columnIdLike}":"", "${columnIdDislike}":""}`);

    await mondayService.changeMultipleColumnValues(shortLivedToken, boardId, itemId, columnValues);
    /*await mondayService.changeColumnValue(shortLivedToken, boardId, itemId, columnIdView, 0);
    await mondayService.changeColumnValue(shortLivedToken, boardId, itemId, columnIdLike, 0);
    await mondayService.changeColumnValue(shortLivedToken, boardId, itemId, columnIdDislike, 0);*/
    return res.status(200).send({ result: 'Ok!' });;
  }

  // get youtube ID
  const youtubeVideoId = baseService.getYoutubeId(columnValueUrlVal);

  // verification
  if(youtubeVideoId == '') return res.status(200).send({ result: 'Ok!' });;

  console.log('YOUTUBE_API_KEY' + process.env.YOUTUBE_API_KEY )

  // call youtube API
  const webpageData = await callYoutubeAPI(youtubeVideoId);

  // update
  if(webpageData.viewCount == null) return res.status(200).send({ result: 'NOk!' });;

  console.log('pppppp');

  // update column value
  columnValues = JSON.stringify(`{"${columnIdView}":"${webpageData.viewCount}", "${columnIdLike}":"${webpageData.likeCount}", "${columnIdDislike}":"${webpageData.dislikeCount}"}`);
  await mondayService.changeMultipleColumnValues(shortLivedToken, boardId, itemId, columnValues);
  /*
  await mondayService.changeColumnValue(shortLivedToken, boardId, itemId, columnIdView, webpageData.viewCount);
  await mondayService.changeColumnValue(shortLivedToken, boardId, itemId, columnIdLike, webpageData.likeCount);
  await mondayService.changeColumnValue(shortLivedToken, boardId, itemId, columnIdDislike, webpageData.dislikeCount);*/


  console.log(' itemId '+ itemId+ ' columnValueUrlVal '+columnValueUrlVal+ ' youtubeId '+youtubeVideoId)

  return res.status(200).send({ result: 'Ok!' });
}



module.exports = {
  getFieldDefs,
  updateFields
};
