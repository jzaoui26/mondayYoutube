const initMondayClient = require('monday-sdk-js');

const getColumnValue = async (token, itemId, columnId) => {
  try {
    const mondayClient = initMondayClient();
    mondayClient.setToken(token);

    const query = `query{
        items (ids: ${itemId}) {
          column_values(ids:${columnId}) {
            value
          }
        }
      }`;

    const response = await mondayClient.api(query, {  });
    return response.data.items[0].column_values[0].value;
  } catch (err) {
    console.error(err);
  }
};

const getColumnsBoard = async (token, boardId) => {
  try {
    const mondayClient = initMondayClient();
    mondayClient.setToken(token);

    const query = `query{
        boards ( ids: ${boardId}) {
      
          columns {
            id
            title
            type
          }
        }
      }`;

    const response = await mondayClient.api(query, {  });
    return response.data.boards[0].columns;
  } catch (err) {
    console.error(err);
  }
};

const getItemId = async (token, boardId, columnId, value) => {
  try {
    const mondayClient = initMondayClient({ token });

    const query = `query {
                      items_by_column_values (board_id: ${boardId}, column_id:  "${columnId}", column_value: "${value}") {
                      id
                    }
                  }`;

    const response = await mondayClient.api(query, { });

    return response.data.items_by_column_values[0] ? response.data.items_by_column_values[0].id : 0;
  } catch (err) {
    console.error(err);
  }
};

const changeColumnValue = async (token, boardId, itemId, columnId, value) => {
  try {
    const mondayClient = initMondayClient({ token });

    const query = `mutation change_column_value  {
        change_column_value(board_id: ${boardId}, item_id: ${itemId}, column_id: "${columnId}", value: "${value}") {
          id
        }
      }
      `;

    const response = await mondayClient.api(query, {  });
    return response;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  changeColumnValue,
  getColumnsBoard,
  getItemId
};
