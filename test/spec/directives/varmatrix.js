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
    var expected = '<table class="table varmatrix ng-scope" style="width:40%"><caption>Portfolio VaR (with 90.00 % unallocated)</caption><tbody><tr><th></th><th nowrap="">1-day</th><th nowrap="">1-week</th><th nowrap="">1-year</th></tr><tr><th nowrap="">VaR 95 %</th><td nowrap=""><divvar varisk="0.1" limit="-0.2" usd="100" flip="false"><div style="color:inherit" title="Red if 10.00 % &lt; -20.00 %"><div>10.00 %</div><div>10.00 USD</div></div></divvar></td><td nowrap=""><divvar varisk="0.1" limit="-0.2" usd="100" flip="false"><div style="color:inherit" title="Red if 10.00 % &lt; -20.00 %"><div>10.00 %</div><div>10.00 USD</div></div></divvar></td><td nowrap=""><divvar varisk="0.1" limit="-0.2" usd="100" flip="false"><div style="color:inherit" title="Red if 10.00 % &lt; -20.00 %"><div>10.00 %</div><div>10.00 USD</div></div></divvar></td></tr><tr><th nowrap="">VaR 99 %</th><td nowrap=""><divvar varisk="0.1" limit="-0.2" usd="100" flip="false"><div style="color:inherit" title="Red if 10.00 % &lt; -20.00 %"><div>10.00 %</div><div>10.00 USD</div></div></divvar></td><td nowrap=""><divvar varisk="0.1" limit="-0.2" usd="100" flip="false"><div style="color:inherit" title="Red if 10.00 % &lt; -20.00 %"><div>10.00 %</div><div>10.00 USD</div></div></divvar></td><td nowrap=""><divvar varisk="0.1" limit="-0.2" usd="100" flip="false"><div style="color:inherit" title="Red if 10.00 % &lt; -20.00 %"><div>10.00 %</div><div>10.00 USD</div></div></divvar></td></tr></tbody></table>';
    expect(element.html()).toBe(expected);
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
    var expected = 
    '<th class="ng-scope">bla</th>'+
    '<td nowrap="" class="varmatrix ng-scope">'+
      '<divvar varisk="1" limit="-0.2" usd="100" flip="false">'+
      '<div style="color:inherit" title="Red if 100.00 % &lt; -20.00 %">'+
          '<div>100.00 %</div>'+
          '<div>100.00 USD</div>'+
        '</div>'+
      '</divvar>'+
    '</td>'+
    '<td nowrap="" class="varmatrix ng-scope"><divvar varisk="1" limit="-0.2" usd="100" flip="false"><div style="color:inherit" title="Red if 100.00 % &lt; -20.00 %"><div>100.00 %</div><div>100.00 USD</div></div></divvar></td>'+
    '<td nowrap="" class="varmatrix ng-scope"><divvar varisk="1" limit="-0.2" usd="100" flip="false"><div style="color:inherit" title="Red if 100.00 % &lt; -20.00 %"><div>100.00 %</div><div>100.00 USD</div></div></divvar></td>'+
    '<td nowrap="" class="varmatrix ng-scope"><divvar varisk="1" limit="-0.2" usd="100" flip="false"><div style="color:inherit" title="Red if 100.00 % &lt; -20.00 %"><div>100.00 %</div><div>100.00 USD</div></div></divvar></td>'+
    '<td nowrap="" class="varmatrix ng-scope"><divvar varisk="1" limit="-0.2" usd="100" flip="false"><div style="color:inherit" title="Red if 100.00 % &lt; -20.00 %"><div>100.00 %</div><div>100.00 USD</div></div></divvar></td>'+
    '<td nowrap="" class="varmatrix ng-scope"><divvar varisk="1" limit="-0.2" usd="100" flip="false"><div style="color:inherit" title="Red if 100.00 % &lt; -20.00 %"><div>100.00 %</div><div>100.00 USD</div></div></divvar></td>';
    expect(element.html()).toBe(expected);
  }));

  it('row body asset', inject(function ($compile) {
    scope.calculateVaR=function() { return 1; };
    scope.portfolio={id:1,value:100};
    scope.a = {qty: 2, pnls: [0.15], historyMeta: { lastprice: 5 } };

    element = angular.element('<tr varmatrix type="rowBodyAsset"><th>bla</th></tr>');
    element = compileAndDigest(element,scope,$compile);
    var expected = '<th class="ng-scope">bla</th><td nowrap="" class="varmatrix ng-scope"><divvar varisk="1" limit="0.15" usd="10" flip="true"><div style="color:red" title="Red if 15.00 % &lt; 100.00 %"><div>100.00 %</div><div>10.00 USD</div></div></divvar></td><td nowrap="" class="varmatrix ng-scope"><divvar varisk="1" limit="0.15" usd="10" flip="true"><div style="color:red" title="Red if 15.00 % &lt; 100.00 %"><div>100.00 %</div><div>10.00 USD</div></div></divvar></td><td nowrap="" class="varmatrix ng-scope"><divvar varisk="1" limit="0.15" usd="10" flip="true"><div style="color:red" title="Red if 15.00 % &lt; 100.00 %"><div>100.00 %</div><div>10.00 USD</div></div></divvar></td><td nowrap="" class="varmatrix ng-scope"><divvar varisk="1" limit="0.15" usd="10" flip="true"><div style="color:red" title="Red if 15.00 % &lt; 100.00 %"><div>100.00 %</div><div>10.00 USD</div></div></divvar></td><td nowrap="" class="varmatrix ng-scope"><divvar varisk="1" limit="0.15" usd="10" flip="true"><div style="color:red" title="Red if 15.00 % &lt; 100.00 %"><div>100.00 %</div><div>10.00 USD</div></div></divvar></td><td nowrap="" class="varmatrix ng-scope"><divvar varisk="1" limit="0.15" usd="10" flip="true"><div style="color:red" title="Red if 15.00 % &lt; 100.00 %"><div>100.00 %</div><div>10.00 USD</div></div></divvar></td>';
    expect(element.html()).toBe(expected);
  }));

  it('column', inject(function ($compile) {
    scope.calculateVaR=function() { return 1; };
    element = angular.element('<div varmatrix type="column"></div>');
    element = compileAndDigest(element,scope,$compile);
//    expect(element.find('table>tr').length).toBe(2);
    var expected = '<table class="table varmatrix"><tbody>'+
      '<tr><td></td><td>1-day</td><td>1-week</td><td>1-year</td></tr>'+
      '<tr><td>VaR 95%</td><td>100.00 %</td><td>100.00 %</td><td>100.00 %</td></tr>'+
      '<tr><td>VaR 99%</td><td>100.00 %</td><td>100.00 %</td><td>100.00 %</td></tr>'+
      '</tbody></table>';
    expect(element.html()).toBe(expected);
  }));

});
