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
    element = angular.element('<tr varmatrix type="rowHeader"><th>bla</th></tr>');
    element = $compile(element)(scope);
    var expected = '<th>bla</th><th>VaR 95%, 1-day</th><th>VaR 95%, 1-week</th><th>VaR 95%, 1-year</th><th>VaR 99%, 1-day</th><th>VaR 99%, 1-week</th><th>VaR 99%, 1-year</th>';
    expect(element.html()).toBe(expected);
  }));

  it('row body', inject(function ($compile) {
    scope.portfolioVaR=function() { return 1; };
    scope.p={value:100};

    element = angular.element('<tr varmatrix type="rowBody"><th>bla</th></tr>');
    element = $compile(element)(scope);
    var expected = '<th>bla</th><td><div>100 %</div><div>100 %</div></td><td><div>100 %</div><div>100 %</div></td><td><div>100 %</div><div>100 %</div></td><td><div>100 %</div><div>100 %</div></td><td><div>100 %</div><div>100 %</div></td><td><div>100 %</div><div>100 %</div></td>';
    expect(element.html()).toBe(expected);
  }));

});
