'use strict';

describe('Service: ffa', function () {

  // load the service's module
  beforeEach(module('theVarApp'));

  // instantiate service
  var ffa;
  beforeEach(inject(function (_ffa_) {
    ffa = _ffa_;
  }));

  it('should do something', function () {
    expect(!!ffa).toBe(true);
  });

});
