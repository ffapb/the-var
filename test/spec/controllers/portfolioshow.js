'use strict';

describe('Controller: PortfolioshowCtrl', function () {

  // load the controller's module
  beforeEach(module('theVarApp'));

  var PortfolioshowCtrl, scope, PortfoliosM;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, Portfolios) {
    scope = $rootScope.$new();
    PortfolioshowCtrl = $controller('PortfolioshowCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
    PortfoliosM = Portfolios;
    var ppp = {
      '1': {
        'id': '1',
        'src': 'mod',
        'name': 'portfolio 1',
        'assets': [
          { 'src': 'mod',
            'symbol': 'symbol 1'
          },
          { 'src': 'mod',
            'symbol': 'symbol 2'
          }
        ]
      }
    };
    PortfoliosM.set(ppp);
  }));

  it('some tests', function () {
    scope.set('1');
    expect(scope.portfolio).not.toBeNull();
    expect(scope.alist).not.toBeNull();
  });

  it('calculateVaR', function () {
    var p1 = { pnls: [2], historyDateless: [1,1,1,1,1,1,1,1] };
    expect(scope.calculateVaR(p1,95,1)).toBe(0);
  });

});
