'use strict';

describe('Controller: AssetAddCtrl', function () {

  // load the controller's module
  beforeEach(module('theVarApp'));

  var AssetAddCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssetAddCtrl = $controller('AssetAddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AssetAddCtrl.awesomeThings.length).toBe(3);
  });
});
