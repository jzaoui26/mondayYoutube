const fetch = require('node-fetch');
var fs = require('fs');
var parse = require('csv-parse');
let uniqueMapItem;

const mondayService = require('../services/monday-service');

const triggers = {};
let nextTriggerId = 1;

class BaseService {
  static addIntervalTrigger(webhookUrl, interval) {
    console.log('ddd '+interval)

    if (typeof interval !== 'number' || interval < 10) throw new Error('Bad interval');

    const intervalId = setInterval(async () => {
      try {
        const body = JSON.stringify({
          trigger: { outputFields: { columnValue: { value: new Date().toISOString() } } },
        });

        const resp = await fetch(webhookUrl, {
          method: 'POST',
          body,
          headers: {
            authorization: process.env.MONDAY_SIGNING_SECRET,
            contentType: 'application/json',
          },
        });

        const text = await resp.text();

        console.log('Triggered: ', body, 'response', text);
      } catch (e) {
        console.error('Oops, trigger failed', e);
      }
    }, interval);

    const triggerId = nextTriggerId++;
    triggers[triggerId] = intervalId;

    console.log('addIntervalTrigger, triggerId=', triggerId);
    return triggerId;
  }

  static removeStatTrigger(triggerId) {
    console.log('removeStatTrigger triggerId=', triggerId);
    if (typeof triggerId !== 'number') throw new Error('Bad trigerId');

    const intervalId = triggers[triggerId];
    if (intervalId === undefined) return;

    clearInterval(intervalId);
    delete triggers[triggerId];
  }

  static getColumnNameId(columnsBoard, columnNameBase)
  {
    var filtered = columnsBoard.filter(function(columnBoard) {
      return columnBoard.title.toUpperCase() == columnNameBase.toUpperCase();
    });

    const columnId = filtered[0] ? filtered[0].id : '';

    return columnId;
  }

  static async getItemId (token, boardId, columnUniqueId, idUnique)  {
    let itemId

    // verify in map
    if(uniqueMapItem.has(idUnique))
    {
      itemId =  uniqueMapItem.get(idUnique)
    }
    // else
    else
    {
      // get
      const itemIdTmp = await mondayService.getItemId(token, boardId, columnUniqueId, idUnique);

      // set map
      uniqueMapItem.set(idUnique, itemIdTmp );

      itemId = itemIdTmp;
    }

    return itemId;
  };

  static async manageRowCSV(shortLivedToken, boardId, columnUniqueId, csvrow, columnsBoard)
  {
    let type = '';
    let idUnique, columnName, columnValue;

    type          = csvrow[0];
    idUnique      = csvrow[1];
    columnName    = csvrow[4];
    columnValue   = csvrow[5];

    // verify
    if(idUnique == '') return false;

    // get itemId
    const columnId = BaseService.getColumnNameId(columnsBoard, columnName)

    // verify
    if(columnId == '') return false;

    // verify in map
    const itemId = await BaseService.getItemId(shortLivedToken, boardId, columnUniqueId, idUnique);

    // get item ID and put into map for update
    // if type ADD or update
    if(type == 'ADD' || type == 'MOD')
    {
      await mondayService.changeColumnValue(shortLivedToken, boardId, itemId, columnId, columnValue);

      console.log('add or mod ' + ' changeColumnValue itemId '+ itemId + ' columnId '+ columnId+ ' columnValue '+ columnValue)
    }

    // // if DEL => delete
    else if(type == 'DEL')
    {

    }

    return true;
  }

  static async synchronizeCSV(req, boardId, columnUniqueId)
  {
    const { shortLivedToken } = req.session;
    console.log('synchronize boardId=', boardId+ ' columnUniqueId '+columnUniqueId);

    // read csv
    var csvData=[];
    var inputFile = 'src/import/sample.csv';
    let compteur = 0;

    // map
    uniqueMapItem = new Map()


    // get column values
    try {
      const columnsBoard = await mondayService.getColumnsBoard(shortLivedToken, boardId);

      try
      {
        fs.createReadStream(inputFile)
          .pipe(parse({delimiter: ';'}))
          .on('data', function(csvrow)
          {
            // no for title
            if(compteur >= 1)
            {
                BaseService.manageRowCSV(shortLivedToken, boardId, columnUniqueId, csvrow, columnsBoard);
            }

            compteur++;
          })
          .on('end',function() {

          });
      }
      catch (e) {
        console.error('Oops, trigger failed', e);
      }
    }
    catch (e) {
      console.error('Oops, trigger failed', e);
    }




  }

  static async fetchHook(webhookUrl)
  {
    try {
      const body = JSON.stringify({
        trigger: { outputFields: { columnValue: { value: new Date().toISOString() } } },
      });

      const resp = await fetch(webhookUrl, {
        method: 'POST',
        body,
        headers: {
          authorization: process.env.MONDAY_SIGNING_SECRET,
          contentType: 'application/json',
        },
      });

      const text = await resp.text();

      console.log('Triggered: ', body, 'response', text);
    } catch (e) {
      console.error('Oops, trigger failed', e);
    }
  }
  static addScheduledTrigger(webhookUrl, hour, utcDaysDiff, timezone) {


    const intervalMin = 150
    const interval = intervalMin * 1000 * 60 ;

    BaseService.fetchHook(webhookUrl);

    const intervalId = setInterval(async () => {
      try {
        const body = JSON.stringify({
          trigger: { outputFields: { columnValue: { value: new Date().toISOString() } } },
        });

        const resp = await fetch(webhookUrl, {
          method: 'POST',
          body,
          headers: {
            authorization: process.env.MONDAY_SIGNING_SECRET,
            contentType: 'application/json',
          },
        });

        const text = await resp.text();

        console.log('Triggered: ', body, 'response', text);
      } catch (e) {
        console.error('Oops, trigger failed', e);
      }
    }, interval);

    const triggerId = nextTriggerId++;
    triggers[triggerId] = intervalId;

    console.log('addIntervalTrigger, triggerId=', triggerId);
    return triggerId;
  }
}

module.exports = BaseService;
