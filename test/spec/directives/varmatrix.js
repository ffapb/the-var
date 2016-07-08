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
    expect(element.text()).toBe('');
  }));

  it('matrix 3', inject(function ($compile) {
    scope.portfolioVaR=function() { return 1; };
    scope.portfolio={value:100};
    element = angular.element('<varmatrix type="matrix"></varmatrix>');
    element = $compile(element)(scope);
    expect(element.find('tr').length).toBe(4);
    var expected = '<table class="table ng-scope" style="width:40%"><caption>PortfolioVaR</caption><tbody><tr><th></th><th>95%</th><th>99%</th></tr><tr><th>1-day</th><td><divvar varisk="1" limit="-0.2" usd="100" flip="false"><div style="color:black" title="Red if 100.00 % &lt; -20.00 %"><div>100.00 %</div><div>100.00 USD</div></div></divvar></td><td><divvar varisk="1" limit="-0.2" usd="100" flip="false"><div style="color:black" title="Red if 100.00 % &lt; -20.00 %"><div>100.00 %</div><div>100.00 USD</div></div></divvar></td></tr><tr><th>1-week</th><td><divvar varisk="1" limit="-0.2" usd="100" flip="false"><div style="color:black" title="Red if 100.00 % &lt; -20.00 %"><div>100.00 %</div><div>100.00 USD</div></div></divvar></td><td><divvar varisk="1" limit="-0.2" usd="100" flip="false"><div style="color:black" title="Red if 100.00 % &lt; -20.00 %"><div>100.00 %</div><div>100.00 USD</div></div></divvar></td></tr><tr><th>1-year</th><td><divvar varisk="1" limit="-0.2" usd="100" flip="false"><div style="color:black" title="Red if 100.00 % &lt; -20.00 %"><div>100.00 %</div><div>100.00 USD</div></div></divvar></td><td><divvar varisk="1" limit="-0.2" usd="100" flip="false"><div style="color:black" title="Red if 100.00 % &lt; -20.00 %"><div>100.00 %</div><div>100.00 USD</div></div></divvar></td></tr></tbody></table>';
    expect(element.html()).toBe(expected);
  }));

  it('row header', inject(function ($compile) {
    element = angular.element('<tr varmatrix type="rowHeader"><th>bla</th></tr>');
    element = $compile(element)(scope);
    var expected = '<th>bla</th><th>VaR 95%, 1-day</th><th>VaR 95%, 1-week</th><th>VaR 95%, 1-year</th><th>VaR 99%, 1-day</th><th>VaR 99%, 1-week</th><th>VaR 99%, 1-year</th>';
    expect(element.html()).toBe(expected);
  }));

  it('row body portfolio', inject(function ($compile) {
    scope.portfolioVaR=function() { return 1; };
    scope.p={value:100};

    element = angular.element('<tr varmatrix type="rowBodyPortfolio"><th>bla</th></tr>');
    element = $compile(element)(scope);
    var expected = '<th>bla</th><td nowrap=""><div>100.00 %</div><div>100.00 USD</div></td><td nowrap=""><div>100.00 %</div><div>100.00 USD</div></td><td nowrap=""><div>100.00 %</div><div>100.00 USD</div></td><td nowrap=""><div>100.00 %</div><div>100.00 USD</div></td><td nowrap=""><div>100.00 %</div><div>100.00 USD</div></td><td nowrap=""><div>100.00 %</div><div>100.00 USD</div></td>';
    expect(element.html()).toBe(expected);
  }));

// row is removed. Check note in app/scripts/directives/varmatrix.js
//  it('row', inject(function ($compile) {
//    element = angular.element(
//      '<table varmatrix type="row">'+
//      '<thead><tr><th>bla</th></tr></thead>'+
//      '<tbody><tr><th>foo</th></tr></tbody>'+
//      '</table>'
//    );
//    scope.portfolioVaR=function() { return 1; };
//    scope.p={value:100};
//    element = $compile(element)(scope);
//
//    var expHead = '<th>bla</th><th>VaR 95%, 1-day</th><th>VaR 95%, 1-week</th><th>VaR 95%, 1-year</th><th>VaR 99%, 1-day</th><th>VaR 99%, 1-week</th><th>VaR 99%, 1-year</th>';
//    var expBody = '<th>foo</th><td nowrap=""><div>100.00 %</div><div>100.00 USD</div></td><td nowrap=""><div>100.00 %</div><div>100.00 USD</div></td><td nowrap=""><div>100.00 %</div><div>100.00 USD</div></td><td nowrap=""><div>100.00 %</div><div>100.00 USD</div></td><td nowrap=""><div>100.00 %</div><div>100.00 USD</div></td><td nowrap=""><div>100.00 %</div><div>100.00 USD</div></td>';
//    var expected = '<thead><tr>'+expHead+'</tr></thead><tbody><tr>'+expBody+'</tr></tbody>';
//    expect(element.html()).toBe(expected);
//  }));

  it('row body asset', inject(function ($compile) {
    scope.calculateVaR=function() { return 1; };
    scope.portfolio={value:100};
    scope.a = {pct: 10, pnls2: [15]};

    element = angular.element('<tr varmatrix type="rowBodyAsset"><th>bla</th></tr>');
    element = $compile(element)(scope);
    var expected = '<th class="ng-scope">bla</th><td nowrap="" class="ng-scope"><divvar varisk="1" limit="0.15" usd="10" flip="true"><div style="color:red" title="Red if 15.00 % &lt; 100.00 %"><div>100.00 %</div><div>10.00 USD</div></div></divvar></td><td nowrap="" class="ng-scope"><divvar varisk="1" limit="0.15" usd="10" flip="true"><div style="color:red" title="Red if 15.00 % &lt; 100.00 %"><div>100.00 %</div><div>10.00 USD</div></div></divvar></td><td nowrap="" class="ng-scope"><divvar varisk="1" limit="0.15" usd="10" flip="true"><div style="color:red" title="Red if 15.00 % &lt; 100.00 %"><div>100.00 %</div><div>10.00 USD</div></div></divvar></td><td nowrap="" class="ng-scope"><divvar varisk="1" limit="0.15" usd="10" flip="true"><div style="color:red" title="Red if 15.00 % &lt; 100.00 %"><div>100.00 %</div><div>10.00 USD</div></div></divvar></td><td nowrap="" class="ng-scope"><divvar varisk="1" limit="0.15" usd="10" flip="true"><div style="color:red" title="Red if 15.00 % &lt; 100.00 %"><div>100.00 %</div><div>10.00 USD</div></div></divvar></td><td nowrap="" class="ng-scope"><divvar varisk="1" limit="0.15" usd="10" flip="true"><div style="color:red" title="Red if 15.00 % &lt; 100.00 %"><div>100.00 %</div><div>10.00 USD</div></div></divvar></td>';
    expect(element.html()).toBe(expected);
  }));

  it('column', inject(function ($compile) {
    scope.calculateVaR=function() { return 1; };
    element = angular.element('<table varmatrix type="column"><tr><td>bla</td></tr></table>');
    element = $compile(element)(scope);
    expect(element.find('tr').length).toBe(5);
    var expected = '<table><tr><td>bla</td></table>';
    expect(element.html()).toBe(expected);
  }));

});
