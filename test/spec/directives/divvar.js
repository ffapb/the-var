'use strict';

describe('Directive: divvar', function () {

  // load the directive's module
  beforeEach(module('theVarApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<divvar></divvar>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the divvar directive');
  }));
});
