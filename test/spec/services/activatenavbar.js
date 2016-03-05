'use strict';

describe('Service: activateNavBar', function () {

  // load the service's module
  beforeEach(module('theVarApp'));

  // instantiate service
  var activateNavBar;
  beforeEach(inject(function (_activateNavBar_) {
    activateNavBar = _activateNavBar_;
  }));

  it('should do something', function () {
    expect(!!activateNavBar).toBe(true);
  });

});
