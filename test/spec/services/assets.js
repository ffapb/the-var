'use strict';

describe('Service: Assets', function () {

  // load the service's module
  beforeEach(module('theVarApp'));

  // instantiate service
  var Assets;
  beforeEach(inject(function (_Assets_) {
    Assets = _Assets_;
  }));

  it('should do something', function () {
    expect(!!Assets).toBe(true);
  });

});
