'use strict';

describe('Controller: PortfolioaddCtrl', function () {

  // load the controller's module
  beforeEach(module('theVarApp'));

  var PortfolioaddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PortfolioaddCtrl = $controller('PortfolioaddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PortfolioaddCtrl.awesomeThings.length).toBe(3);
  });
});
