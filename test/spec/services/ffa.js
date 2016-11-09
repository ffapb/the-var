'use strict';

var config = {
  endPoints: {
    portfolios: 'http://192.168.125.126/ffa-mfe/databases-api/api/getAccountSecurities.php',
    prices: '/ffa-mfe/the-var-ffa/getHistory.php'
  },
  accounts: [
    { base: 'Lebanon', a: 'AC1' },
    { base: 'Lebanon', a: 'AC2' }
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
  'x11': { 'x11': { 'Elements': [{'DataSeries':{'close':{'values':100}}}], 'Dates': ['2015-01-01'] } },
  'x21': { 'x21': { 'Elements': [{'DataSeries':{'close':{'values':100}}}], 'Dates': ['2015-01-01'] } },
  'x22': { 'x22': { 'Elements': [{'DataSeries':{'close':{'values':100}}}], 'Dates': ['2015-01-01'] } },
  'x31': { 'x31': { 'Elements': [{'DataSeries':{'close':{'values':100}}}], 'Dates': ['2015-01-01'] } }
};

// tests
describe('Service: ffa', function () {

  // load the service's module
  beforeEach(module('theVarApp'));

  // instantiate service
  var ffa, http, Assets, Portfolios;
  beforeEach(inject(function (_ffa_, $httpBackend, _Assets_, _Portfolios_) {
    ffa = _ffa_;
    http = $httpBackend;
    Assets = _Assets_;
    Portfolios = _Portfolios_;
  }));

  function httpExpectGet(withPrices, _conf_) {
    if(!_conf_) {
      _conf_=config;
    }

    // first GET for checkAvailable
    http.expectGET(/the-var-config.json/).respond(_conf_);
    // 2nd GET for ffaConfig1
    http.expectGET(/the-var-config.json/).respond(_conf_);

    // prepare to iterate
    var account, portfolio;

    // iterate over accounts
    for(var ac in _conf_.accounts) {
      account = _conf_.accounts[ac];
      // 3rd GET for securities of each account
      var re1 = new RegExp(
        config.endPoints.portfolios +
        '.*'+account.base +
        '.*'+account.a
      );
      portfolio = portfolios[account.base][account.a];
      http.expectGET(re1).respond(portfolio);
    }

    // iterate over securities
    if(withPrices) {
      for(ac in config.accounts) {
        account = config.accounts[ac];
        portfolio = portfolios[account.base][account.a];
        // 4th get prices of securities
        for(var sec in portfolio) {
          var isin = portfolio[sec].TIT_ISIN_BBG;
          var re2 = new RegExp(config.endPoints.prices+'.*'+isin);
          var price = prices[isin];
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
    Portfolios.clear();
    expect(Portfolios.np()).toEqual(0);
    httpExpectGet(false);
    ffa.portfolios().then(function() {
      expect(ffa.np()).toEqual(2);
      expect(Portfolios.np()).toEqual(2);
      done();
    });
    http.flush();
  });

  it('can abort getting portfolios and resume again later', function (done) {
    Portfolios.clear();
    Assets.clear();
    httpExpectGet(false);

    // call abort
    ffa.setAbort();

    // check that we're starting at 0
    expect(ffa.np()).toEqual(0);
    // run portfolios
    ffa.portfolios().then(function() {
      // should not have gotten anything
      expect(ffa.np()).toEqual(0);
      expect(Assets.na()).toEqual(0);
      expect(Portfolios.np()).toEqual(0);
      // now try to get portfolios again
      ffa.portfolios().then(function() {
        // now got 2 portfolios
        expect(ffa.np()).toEqual(2);
        expect(Assets.na()).toEqual(3);
        expect(Portfolios.np()).toEqual(2);
        done();
      });
    });
    http.flush();
  });

  it('can get prices of portfolio securities', function (done) {
    Portfolios.clear();
    Assets.clear();
    expect(Assets.na()).toEqual(0);
    expect(ffa.np()).toEqual(0);
    expect(Portfolios.np()).toEqual(0);

    httpExpectGet(true);

    // run portfolios
    ffa.portfolios().then(function() {
      // assert that we got 2 portfolios
      expect(ffa.np()).toEqual(2);
      expect(Portfolios.np()).toEqual(2);
      // assert that we are ready for prices
      expect(ffa.readyForPrices()).toBe(true);
      // get security prices
      ffa.portfolioPrices().then(function() {
        expect(Assets.na()).toEqual(3);
        expect(Assets.exists('FFA MF','x11')).toBe(true);
        expect(Assets.list()['FFA MF'].x11.historyMeta.mindate).toBe('2015-01-01');
        expect(Assets.list()['FFA MF'].x11.history.length).toBe(1);
        done();
      });
    });
    http.flush();
  });

  it('detects invalid config', function (done) {
    httpExpectGet(false,{});

    // run portfolios
    ffa.portfolios().then(function() {
      // shouldnt get here
      expect(false).toEqual(true);
      done();
    }, function(reason) {
      expect(reason).toEqual('Config missing accounts field');
      done();
    });
    http.flush();
  });

  it('handles empty accounts in config', function (done) {
    httpExpectGet(false,{'accounts':[]});

    // run portfolios
    ffa.portfolios().then(function() {
      // should get here
      expect(false).toEqual(false);
      done();
    }, function() {
      // shouldnt get here
      expect(false).toEqual(true);
      done();
    });
    http.flush();
  });

});
