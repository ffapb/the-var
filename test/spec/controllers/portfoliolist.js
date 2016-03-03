'use strict';

describe('Controller: PortfoliolistCtrl', function () {

  // load the controller's module
  beforeEach(module('theVarApp'));

  var PortfoliolistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PortfoliolistCtrl = $controller('PortfoliolistCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PortfoliolistCtrl.awesomeThings.length).toBe(3);
  });
});
