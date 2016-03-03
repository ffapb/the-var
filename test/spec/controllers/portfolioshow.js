'use strict';

describe('Controller: PortfolioshowCtrl', function () {

  // load the controller's module
  beforeEach(module('theVarApp'));

  var PortfolioshowCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PortfolioshowCtrl = $controller('PortfolioshowCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PortfolioshowCtrl.awesomeThings.length).toBe(3);
  });
});
