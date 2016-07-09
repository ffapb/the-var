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
    expect(element.text()).toBe('NaN %NaN USD');
  }));

  it('color black', inject(function ($compile) {
    element = angular.element('<divvar varisk=10 limit=5 usd=100></divvar>');
    element = $compile(element)(scope);
    expect(element.find('div').attr('style')).toBe('color:inherit');

    element = angular.element('<divvar varisk=10 limit=5 usd=100></divvar>');
    element = $compile(element)(scope);
    expect(element.find('div').attr('style')).toBe('color:inherit');
  }));

  it('color red', inject(function ($compile) {
    element = angular.element('<divvar varisk=1 limit=5 usd=100></divvar>');
    element = $compile(element)(scope);
    expect(element.find('div').attr('style')).toBe('color:red');
  }));

  it('color orange', inject(function ($compile) {
    element = angular.element('<divvar varisk=5 limit=5 usd=100></divvar>');
    element = $compile(element)(scope);
    expect(element.find('div').attr('style')).toBe('color:orange');
  }));

});
