'use strict';

var request  = require('request');
var md5 = require('MD5');

/**
 * OKCoin connects to the OKCoin.cn API
 * @param {String} partner    
 * @param {String} secret API Secret
 */
function OKCoin(partner, secret) {
  var self = this;

  var config = {
    url: 'https://www.okcoin.com/api',
    version: 'v1',
    partner: partner,
    secret: secret
  };

  /**
  * Regular account
  */
  function ticker(callback) {
    var path  = '/' + config.version + '/ticker.do';
    return publicMethod(path, callback);
  }
  
  function depth(callback) {
    var path  = '/' + config.version + '/depth.do';
    return publicMethod(path, callback);
  }
  
  function trades(callback) {
    var path  = '/' + config.version + '/trades.do';
    return publicMethod(path, callback);
  }
   
  function userinfo(callback) {
    var path  = '/' + config.version + '/userinfo.do';
    var params = {};
    return privateMethod(path, params, callback);
  }

  function trade(symbol, type, price, amount, callback) {
    var path  = '/' + config.version + '/trade.do';
    var params = {};
    if (amount) params.amount =  amount;
    if (price) params.price = price;
    params.symbol = symbol;
    params.type = type;
    return privateMethod(path, params, callback);
  }

  /**
  * Futures account
  */

  function futures_ticker(callback) {
    var path  = '/' + config.version + '/future_ticker.do?symbol=btc_usd&contract_type=this_week';
    return publicMethod(path, callback);
  }
  
  function futures_depth(callback) {
    var path  = '/' + config.version + '/future_depth.do?symbol=btc_usd&contract_type=this_week';
    return publicMethod(path, callback);
  }
  
  function futures_trades(callback) {
    var path  = '/' + config.version + '/future_trades.do?symbol=btc_usd&contract_type=this_week';
    return publicMethod(path, callback);
  }

  function futures_userinfo(callback) {
    var path  = '/' + config.version + '/future_userinfo_4fix.do';
    var params = {};
    return privateMethod(path, params, callback);
  }

  function futures_orderinfo(callback) {
    var path  = '/' + config.version + '/future_order_info.do';
    var params = { 
      symbol:'btc_usd' , 
      contract_type:'this_week',
      status: 2,
      order_id : -1, 
      current_page: 1,
      page_length: 50
    };
    return privateMethod(path, params, callback);
  }
  
  function futures_position(callback) {
    var path  = '/' + config.version + '/future_position_4fix.do';
    var params = { symbol:'btc_usd' , contract_type:'this_week' };
    return privateMethod(path, params, callback);
  }

  function futures_trade(symbol, type, price, amount, callback) {
    var path  = '/' + config.version + '/trade.do';
    var params = {};
    if (amount) params.amount =  amount;
    if (price) params.price = price;
    params.symbol = symbol;
    params.type = type;
    return privateMethod(path, params, callback);
  }

  /**
   * This method makes a public API request.
   * @param  {String}   path   The path to the API method 
   * @param  {Function} callback A callback function to be executed when the request is complete
   * @return {Object}            The request object
   */
  function publicMethod(path, callback) {
    var params = null;
    var url    = config.url + path;
    return okcoinRequest(url, 'GET', params, callback);
  }

  /**
   * This method makes a public API request.
   * @param  {String}   path   The path to the API method 
   * @param  {Function} callback A callback function to be executed when the request is complete
   * @return {Object}            The request object
   */
  function publicMethodParams(path, params, callback) {
    var url = config.url + path;
    return okcoinRequest(url, 'GET', params, callback);
  }

  /**
   * This method makes a private API request.
   * @param  {String}   path   The path to the API method 
   * @param  {Object}   params   Arguments to pass to the api call
   * @param  {Function} callback A callback function to be executed when the request is complete
   * @return {Object}            The request object
   */
  function privateMethod(path, params, callback) {
    var url    = config.url + path;
    params.partner = config.partner;
    params.sign  = getMessageSignature(params);
    return okcoinRequest(url, 'POST', params, callback);
  }

  /**
   * This method returns a signature for a request as a md5-encoded uppercase string
   * @param  {Object}  params   The object to encode
   * @return {String}           The request signature
   */
  function getMessageSignature(params) {
    var sign = md5(stringifyToOKCoinFormat(params) + '&secret_key='+ config.secret).toUpperCase();
    return sign;
  }
  
  /**
   * This method returns the parameters as an alphabetically sorted string
   * @param  {Object}  params   The object to encode
   * @return {String}           The request signature
   */
  function stringifyToOKCoinFormat(obj) {
    var arr = [],
        i,
        formattedObject = '';

    for (i in obj) {
        if (obj.hasOwnProperty(i)) {
            arr.push(i);
        }
    }
    arr.sort();
    for (i = 0; i < arr.length; i++) {
        if (i != 0) {
        formattedObject += '&';
        }
        formattedObject += arr[i] + '=' + obj[arr[i]];
    }
    return formattedObject;
}

  /**
   * This method sends the actual HTTP request
   * @param  {String}   url      The URL to make the request
   * @param  {String}   requestType   POST or GET
   * @param  {Object}   params   POST body
   * @param  {Function} callback A callback function to call when the request is complete
   * @return {Object}            The request object
   */
  function okcoinRequest(url, requestType, params, callback) {

    var options = {
      url: url,
      method: requestType,
      form: params
    };
    if(requestType==='GET' && params) {
      options.qs = params;
    }
    
    var req = request(options, function(error, response, body) {
      if(typeof callback === 'function') {
        var data;
        if(error) {
          callback.call(self, new Error('Error in server response: ' + JSON.stringify(error)), null);
          return;
        }
        try {
          data = JSON.parse(body);         
        }
        catch(e) {
          callback.call(self, new Error('Could not understand response from server: ' + body), null);
          return;
        }
        if(data.error_code) {         
          callback.call(self, error_code_meaning(data.error_code), null);
        }
        else {
          callback.call(self, null, data);
        }
      }
    });

    return req;
  }
  
  /**
   * This method return the OKCoin error information
   * @param  {Integer}  error_code   OKCoin error code
   * @return {String}                Error
   */
  function error_code_meaning(error_code) {
        var codes = { 
            10000 : 'Required parameter can not be null',
            10001 : 'Requests are too frequent',
            10002 : 'System Error',
            10003 : 'Restricted list request, please try again later',
            10004 : 'IP restriction',
            10005 : 'Key does not exist',
            10006 : 'User does not exist',
            10007 : 'Signatures do not match',
            10008 : 'Illegal parameter',
            10009 : 'Order does not exist',
            10010 : 'Insufficient balance',
            10011 : 'Order is less than minimum trade amount',
            10012 : 'Unsupported symbol (not btc_cny or ltc_cny)',
            10013 : 'This interface only accepts https requests' 
        };
        if (!codes[error_code]) {
            return 'OKCoin error code :' + error_code +' is unknown or unsupported by the API';
        }
        return( codes[error_code] );
  }
  
  
  self.ticker = ticker;
  self.trades = trades;
  self.depth = depth;
  self.userinfo = userinfo;
  self.trade = trade;

  self.futures_ticker = futures_ticker;
  self.futures_trades = futures_trades;
  self.futures_depth = futures_depth;
  self.futures_userinfo = futures_userinfo;
  self.futures_trade = futures_trade;
  self.futures_orderinfo = futures_orderinfo;
  self.futures_position = futures_position;
}

module.exports = OKCoin;
