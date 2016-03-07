'use strict';

describe('Controller: AssetlistCtrl', function () {

  // load the controller's module
  beforeEach(module('theVarApp'));

  var AssetlistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssetlistCtrl = $controller('AssetlistCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AssetlistCtrl.awesomeThings.length).toBe(3);
  });
});
