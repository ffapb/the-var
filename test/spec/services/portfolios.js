'use strict';

describe('Service: Portfolios', function () {

  // load the service's module
  beforeEach(module('theVarApp'));

  // instantiate service
  var Portfolios;
  beforeEach(inject(function (_Portfolios_) {
    Portfolios = _Portfolios_;
  }));

  it('should do something', function () {
    expect(!!Portfolios).toBe(true);
  });

});
