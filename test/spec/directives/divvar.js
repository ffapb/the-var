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
    expect(element.html()).toBe('<div style="color:orange" title="Red if NaN % &lt; NaN %"><div>NaN %</div><div>NaN USD</div></div>');
  }));

  it('color black', inject(function ($compile) {
    element = angular.element('<divvar varisk=10 limit=5 usd=100></divvar>');
    element = $compile(element)(scope);
    expect(element.find('div').attr('style')).toBe('color:inherit');

    element = angular.element('<divvar varisk=10 limit=5 usd=100></divvar>');
    element = $compile(element)(scope);
    expect(element.find('div').attr('style')).toBe('color:inherit');
    expect(element.html()).toBe('<div style="color:inherit" title="Red if 1000.00 % &lt; 500.00 %"><div>1000.00 %</div><div>1000.00 USD</div></div>');
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
