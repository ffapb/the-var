'use strict';

describe('Directive: varmatrix', function () {

  // load the directive's module
  beforeEach(module('theVarApp'));

  var element,
    scope,
    PortfoliosM;

  function compileAndDigest(element,scope,$compile) {
    element = $compile(element)(scope);
    // call digest to fire watch function
    // http://stackoverflow.com/a/24243128/4126114
    scope.$digest();
    return element;
  }

  jasmine.getFixtures().fixturesPath = 'base/test/spec/javascripts/fixtures';

  beforeEach(inject(function ($rootScope,Portfolios) {
    scope = $rootScope.$new();
    PortfoliosM=Portfolios;
    PortfoliosM.unallocated=function() { return 0; };
  }));

  it('matrix 0', inject(function ($compile) {
    element = angular.element('<varmatrix></varmatrix>');
    element = compileAndDigest(element,scope,$compile);
    expect(element.text()).toBe('');
  }));

  it('matrix 3', inject(function ($compile) {
    scope.portfolioVaR=function() { return 1; };
    scope.unallocated=function() { return 90; };
    scope.portfolio={id:1,value:100};
    element = angular.element('<varmatrix type="matrix"></varmatrix>');
    element = compileAndDigest(element,scope,$compile);
    expect(element.find('tr').length).toBe(3);

    var actual = element.html();
    var expected = 'varmatrix/matrix3.html';
    expected = jasmine.getFixtures().read(expected);
    // other than toBe, can use stuff from here
    // https://github.com/velesin/jasmine-jquery#jquery-matchers
    expect(actual).toBe(expected.trim().replace(/>[\s\t\n]+</g, '><'));
  }));

  it('varmatrix should still be shown only once even after value change twice', inject(function ($compile) {
    scope.portfolioVaR=function() { return 1; };
    scope.unallocated=function() { return 90; };
    scope.portfolio={id:1,value:100};
    element = angular.element('<varmatrix type="matrix"></varmatrix>');
    element = compileAndDigest(element,scope,$compile);
    scope.portfolio={id:1,value:110};
    element = compileAndDigest(element,scope,$compile);
    scope.portfolio={id:1,value:100};
    element = compileAndDigest(element,scope,$compile);
    expect(element.find('tr').length).toBe(3);

    var actual = element.html();
    var expected = 'varmatrix/matrix3.html';
    expected = jasmine.getFixtures().read(expected);
    // other than toBe, can use stuff from here
    // https://github.com/velesin/jasmine-jquery#jquery-matchers
    expect(actual).toBe(expected.trim().replace(/>[\s\t\n]+</g, '><'));
  }));

  it('row header', inject(function ($compile) {
    element = angular.element('<tr varmatrix type="rowHeader"><th>bla</th></tr>');
    element = compileAndDigest(element,scope,$compile);
    var expected = '<th>bla</th><th class="varmatrix">VaR 95%, 1-day</th><th class="varmatrix">VaR 95%, 1-week</th><th class="varmatrix">VaR 95%, 1-year</th><th class="varmatrix">VaR 99%, 1-day</th><th class="varmatrix">VaR 99%, 1-week</th><th class="varmatrix">VaR 99%, 1-year</th>';
    expect(element.html()).toBe(expected);
  }));

  it('row body portfolio', inject(function ($compile) {
    scope.portfolioVaR=function() { return 1; };
    scope.p={id:1,value:100};

    element = angular.element('<tr varmatrix type="rowBodyPortfolio"><th>bla</th></tr>');
    element = compileAndDigest(element,scope,$compile);

    var actual = element.html();
    var expected = 'varmatrix/row_body_portfolio.html';
    expected = jasmine.getFixtures().read(expected);
    expect(actual).toBe(expected.trim().replace(/>[\s\t\n]+</g, '><'));
  }));

  it('row body asset', inject(function ($compile) {
    scope.calculateVaR=function() { return 1; };
    scope.portfolio={id:1,value:100};
    scope.a = {pct: 10, pnls: [0.15] };

    element = angular.element('<tr varmatrix type="rowBodyAsset"><th>bla</th></tr>');
    element = compileAndDigest(element,scope,$compile);

    var actual = element.html();
    var expected = 'varmatrix/row_body_asset.html';
    expected = jasmine.getFixtures().read(expected);
    expect(actual).toBe(expected.trim().replace(/>[\s\t\n]+</g, '><'));
  }));

  it('column', inject(function ($compile) {
    scope.calculateVaR=function() { return 1; };
    element = angular.element('<div varmatrix type="column"></div>');
    element = compileAndDigest(element,scope,$compile);
//    expect(element.find('table>tr').length).toBe(2);

    var actual = element.html();
    var expected = 'varmatrix/column.html';
    expected = jasmine.getFixtures().read(expected);
    expect(actual).toBe(expected.trim().replace(/>[\s\t\n]+</g, '><'));

  }));

});
