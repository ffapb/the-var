'use strict';

describe('Directive: varmatrix', function () {

  // load the directive's module
  beforeEach(module('theVarApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('matrix 0', inject(function ($compile) {
    element = angular.element('<varmatrix></varmatrix>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('This is the varmatrix directive');
  }));

  it('matrix 3', inject(function ($compile) {
    scope.portfolioVaR=function() { return 1; };
    scope.portfolio={value:100};
    element = angular.element('<varmatrix type="matrix"></varmatrix>');
    element = $compile(element)(scope);
    expect(element.find('tr').length).toBe(4);
  }));

  it('row header', inject(function ($compile) {
    element = angular.element('<varmatrix type="rowHeader"></varmatrix>');
    element = $compile(element)(scope);
    console.log(element.html());
    expect(element.find('th').length).toBe(6);
  }));

});
