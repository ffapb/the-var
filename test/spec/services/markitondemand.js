'use strict';

describe('Service: markitOnDemand', function () {

  // load the service's module
  beforeEach(module('theVarApp'));

  // instantiate service
  var markitOnDemand;
  beforeEach(inject(function (_markitOnDemand_) {
    markitOnDemand = _markitOnDemand_;
  }));

  it('should do something', function () {
    expect(!!markitOnDemand).toBe(true);
  });

});
