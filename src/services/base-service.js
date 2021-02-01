const fetch = require('node-fetch');
var fs = require('fs');
var parse = require('csv-parse');

const mondayService = require('../services/monday-service');

const triggers = {};
let nextTriggerId = 1;

class BaseService {

  static  getYoutubeId(url) {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    } else {
      //error
      return '';
    }


  }





}

module.exports = BaseService;
