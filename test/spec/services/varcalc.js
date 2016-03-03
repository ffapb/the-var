'use strict';

describe('Service: varCalc', function () {

  // load the service's module
  beforeEach(module('theVarApp'));

  // instantiate service
  var varCalc;
  beforeEach(inject(function (_varCalc_) {
    varCalc = _varCalc_;
  }));

  it('should do something', function () {
    expect(!!varCalc).toBe(true);
  });

});
