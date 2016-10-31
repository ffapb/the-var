'use strict';

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

  it('can get portfolios', function () {
    var config = {
      endPoints: {
        portfolios: "http://192.168.125.126/ffa-mfe/databases-api/api/getAccountSecurities.php",
        prices: "/ffa-mfe/the-var-ffa/getHistory.php"
      },
      accounts: [
        { base: "Lebanon", a: "FFAI00" }
      ]
    };
    http.expectGET(/the-var-config.json/).respond(config);
    ffa.portfolios();
    expect(ffa.np()).toBeGreaterThan(2);
    http.flush();
  });

});
