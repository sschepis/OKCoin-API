'use strict';

require('should');

var OKCoin = require('../okcoin.js');

if (!process.env.OKCOIN_API_PARTNER) throw new Error('You must specify a OKCOIN_API_PARTNER environment variable to run tests');
if (!process.env.OKCOIN_API_SECRET) throw new Error('You must specify a OKCOIN_API_SECRET environment variable to run tests');

var okcoin = new OKCoin(
  process.env.OKCOIN_API_PARTNER,
  process.env.OKCOIN_API_SECRET
);

describe('okcoin.ticker', function () {
  it('should return ticker info', function (done) {
    okcoin.ticker(function (err, data) {
      if (err) return done(err);
      data.should.have.property('ticker');
      done();
    });
  });
});
describe('okcoin.depth', function () {
  it('should return depth', function (done) {
    okcoin.depth(function (err, data) {
      if (err) return done(err);
      data.should.have.property('asks');
      data.should.have.property('bids');
      done();
    });
  });
});
describe('okcoin.trades', function () {
  it('should return trades', function (done) {
    okcoin.trades(function (err, data) {
      if (err) return done(err);
      data[0].should.have.property('price');
      done();
    });
  });
});
describe('okcoin.userinfo', function () {
  it('should return user info', function (done) {
    okcoin.userinfo(function (err, data) {
      if (err) return done(err);
      data.should.have.property('info');
      done();
    });
  });
});

describe('okcoin.futures_ticker', function () {
  it('should return futures ticker info', function (done) {
    okcoin.futures_ticker(function (err, data) {
      if (err) return done(err);
      data.should.have.property('ticker');
      done();
    });
  });
});
describe('okcoin.futures_depth', function () {
  it('should return futures depth', function (done) {
    okcoin.futures_depth(function (err, data) {
      if (err) return done(err);
      data.should.have.property('asks');
      data.should.have.property('bids');
      done();
    });
  });
});
describe('okcoin.futures_trades', function () {
  it('should return futures trades', function (done) {
    okcoin.futures_trades(function (err, data) {
      if (err) return done(err);
      data[0].should.have.property('price');
      done();
    });
  });
});
describe('okcoin.futures_userinfo', function () {
  it('should return futures user info', function (done) {
    okcoin.futures_userinfo(function (err, data) {
      if (err) return done(err);
      data.should.have.property('info');
      done();
    });
  });
});
describe('okcoin.futures_orderinfo', function () {
  it('should return futures order info', function (done) {
    okcoin.futures_orderinfo(function (err, data) {
      if (err) return done(err);
      data.should.have.property('orders');
      done();
    });
  });
});
describe('okcoin.futures_position', function () {
  it('should return futures position', function (done) {
    okcoin.futures_position(function (err, data) {
      if (err) return done(err);
      data.should.have.property('holding');
      done();
    });
  });
});
/*
 *
 *      WARNING : THESE TESTS WILL SELL OR BUY REAL BTC, 
 *                THOSE TESTS ARE SKIPPED BY DEFAULT
 *
 */
describe.skip('okcoin.trade', function () {
  it('should return sell btc for CNY', function (done) {
    okcoin.trade('btc_cny','sell_market',null, 0.01, function (err, data) {
      if (err) return done(err);
      data.should.have.property('order_id');
      done();
    });
  });
});

