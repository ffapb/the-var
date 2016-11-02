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

describe('Service: ffa', function () {

  // load the service's module
  beforeEach(module('theVarApp'));

  // instantiate service
  var ffa, http;
  beforeEach(inject(function (_ffa_, $httpBackend) {
    ffa = _ffa_;
    http = $httpBackend;
  }));

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
    // first GET for checkAvailable
    http.expectGET(/the-var-config.json/).respond(config);
    // 2nd GET for ffaConfig1
    http.expectGET(/the-var-config.json/).respond(config);
    // 3rd GET for securities of each account
    var re = new RegExp(config.endPoints.portfolios);
    for(var ac in config.accounts) {
      http.expectGET(re).respond([
        {'TIT_ISIN_BBG':'x','TIT_REU_COD':'y','TIT_NOM':'z'}
      ]);
    }
    ffa.portfolios().then(function() {
      expect(ffa.np()).toEqual(2);
      done();
    });
    http.flush();
  });

  it('can abort getting portfolios and resume again later', function (done) {
    // first GET for checkAvailable
    http.expectGET(/the-var-config.json/).respond(config);
    // 2nd GET for ffaConfig1
    http.expectGET(/the-var-config.json/).respond(config);
    // 3rd GET for securities of each account
    var re = new RegExp(config.endPoints.portfolios);
    for(var ac in config.accounts) {
      http.expectGET(re).respond([
        {'TIT_ISIN_BBG':'x','TIT_REU_COD':'y','TIT_NOM':'z'}
      ]);
    }

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
    // portfolio of each account
    var portfolios = [
      [
        {'TIT_ISIN_BBG':'x','TIT_REU_COD':'y','TIT_NOM':'z'}
      ],
      [
        {'TIT_ISIN_BBG':'x','TIT_REU_COD':'y','TIT_NOM':'z'}
      ]
    ];

    // first GET for checkAvailable
    http.expectGET(/the-var-config.json/).respond(config);
    // 2nd GET for ffaConfig1
    http.expectGET(/the-var-config.json/).respond(config);
    // iterate over accounts and securities
    var re1 = new RegExp(config.endPoints.portfolios);
    var re2 = new RegExp(config.endPoints.prices);
    for(var ac in config.accounts) {
      // 3rd GET for securities of each account
      http.expectGET(re1).respond(portfolios[ac]);
      // 4th get prices of securities
      for(var sec in portfolios[ac]) {
        http.expectGET(re2).respond({
          portfolios[sec].TIT_ISIN_BBG: 123
        });
      }
    }

    // run portfolios
    ffa.portfolios().then(function() {
      // assert that we got 2 portfolios
      expect(ffa.np()).toEqual(2);
      // get security prices
      ffa.portfolioPrices().then(function() {
        done();
      });
    });
    http.flush();
  });

});
