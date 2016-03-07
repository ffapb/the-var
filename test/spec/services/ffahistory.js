'use strict';

describe('Service: ffahistory', function () {

  // load the service's module
  beforeEach(module('theVarApp'));

  // instantiate service
  var ffahistory;
  beforeEach(inject(function (_ffahistory_) {
    ffahistory = _ffahistory_;
  }));

  it('should do something', function () {
    expect(!!ffahistory).toBe(true);
  });

});
