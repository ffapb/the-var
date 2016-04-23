'use strict';

describe('Controller: PortfoliolistCtrl', function () {

  // load the controller's module
  beforeEach(module('theVarApp'));

  var PortfoliolistCtrl, scope, PortfoliosM;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, Portfolios) {
    scope = $rootScope.$new();
    PortfoliolistCtrl = $controller('PortfoliolistCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
    PortfoliosM=Portfolios;
    var ppp = {
      "1": {
        "id": "1",
        "src": "mod",
        "name": "portfolio 1",
        "assets": [
          { "src": "mod",
            "symbol": "symbol 1"
          },
          { "src": "mod",
            "symbol": "symbol 2"
          }
        ]
      }
    };
    PortfoliosM.set(ppp);
  }));

  it('a few tests', function () {
    expect(scope.nass("1")).toBe(2);
    expect(scope.nass("doesnt exist")).toBe(0);
    expect(scope.portfolioVaR(95,scope.list()["1"])).toBe(0);
  });
});
