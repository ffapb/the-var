'use strict';

var config = {
  endPoints: {
    portfolios: "http://192.168.125.126/ffa-mfe/databases-api/api/getAccountSecurities.php",
    prices: "/ffa-mfe/the-var-ffa/getHistory.php"
  },
  accounts: [
    { base: "Lebanon", a: "AC1" },
    { base: "Lebanon", a: "AC2" }
  ]
};

// portfolio of each account
var portfolios = {
  'Lebanon': {
    'AC1': [
      {'TIT_ISIN_BBG':'x11', 'TIT_REU_COD':'y11', 'TIT_NOM':'ac1 sec1'}
    ],
    'AC2': [
      {'TIT_ISIN_BBG':'x21', 'TIT_REU_COD':'y21', 'TIT_NOM':'ac2 sec1'},
      {'TIT_ISIN_BBG':'x22', 'TIT_REU_COD':'y22', 'TIT_NOM':'ac2 sec2'}
    ]
  },
  'Dubai': {
    'AC3': [
      {'TIT_ISIN_BBG':'x31', 'TIT_REU_COD':'y31', 'TIT_NOM':'ac3 sec1'}
    ]
  }
};

// prices for securities
var prices = {
  'x11': { 'x11': { 'Elements': { 'close': 100 }, 'Dates': ['2015-01-01'] } },
  'x21': { 'x21': { 'Elements': { 'close': 100 }, 'Dates': ['2015-01-01'] } },
  'x22': { 'x22': { 'Elements': { 'close': 100 }, 'Dates': ['2015-01-01'] } },
  'x31': { 'x31': { 'Elements': { 'close': 100 }, 'Dates': ['2015-01-01'] } }
};

// tests
describe('Service: ffa', function () {

  // load the service's module
  beforeEach(module('theVarApp'));

  // instantiate service
  var ffa, http;
  beforeEach(inject(function (_ffa_, $httpBackend) {
    ffa = _ffa_;
    http = $httpBackend;
  }));

  function httpExpectGet(withPrices) {
    // first GET for checkAvailable
    http.expectGET(/the-var-config.json/).respond(config);
    // 2nd GET for ffaConfig1
    http.expectGET(/the-var-config.json/).respond(config);
    // iterate over accounts
    for(var ac in config.accounts) {
      var account = config.accounts[ac];
      // 3rd GET for securities of each account
      var re1 = new RegExp(
        config.endPoints.portfolios
        +".*"+account.base
        +".*"+account.a
      );
      var portfolio = portfolios[account.base][account.a];
      http.expectGET(re1).respond(portfolio);
    }

    // iterate over securities
    if(withPrices) {
      for(var ac in config.accounts) {
        console.log("http expect -------------- "+(withPrices?'true':'false') );
        var portfolio = portfolios[account.base][account.a];
        // 4th get prices of securities
        var re2 = new RegExp(config.endPoints.prices);
        for(var sec in portfolio) {
          var price = prices[portfolio[sec].TIT_ISIN_BBG];
          console.log("expect prices",re2);
          http.expectGET(re2).respond(price);
        }
      }
    }
  }

  it('should do something', function () {
    expect(!!ffa).toBe(true);
  });

  it('can check availability', function (done) {
    expect(ffa.getAvailable()).toBe(0);
    http.expectGET(/the-var-config.json/).respond({});
    ffa.checkAvailable().then(function() {
      expect(ffa.getAvailable()).toBe(2);
      done();
    });
    http.flush();
  });

  it('can get portfolios', function (done) {
    httpExpectGet(false);
    ffa.portfolios().then(function() {
      expect(ffa.np()).toEqual(2);
      done();
    });
    http.flush();
  });

  it('can abort getting portfolios and resume again later', function (done) {
    httpExpectGet(false);

    // call abort
    ffa.setAbort();

    // check that we're starting at 0
    expect(ffa.np()).toEqual(0);
    // run portfolios
    ffa.portfolios().then(function() {
      // should not have gotten anything
      expect(ffa.np()).toEqual(0);
      // now try to get portfolios again
      ffa.portfolios().then(function() {
        // now got 2 portfolios
        expect(ffa.np()).toEqual(2);
        done();
      });
    });
    http.flush();
  });

  it('can get prices of portfolio securities', function (done) {
    httpExpectGet(true);

    // run portfolios
    ffa.portfolios().then(function() {
      // assert that we got 2 portfolios
      expect(ffa.np()).toEqual(2);
      // assert that we are ready for prices
      expect(ffa.readyForPrices()).toBe(true);
      // get security prices
      ffa.portfolioPrices().then(function() {
        done();
      });
    });
    http.flush();
  });

});
