'use strict';

describe('Controller: AssetshowCtrl', function () {

  // load the controller's module
  beforeEach(module('theVarApp'));

  var AssetshowCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssetshowCtrl = $controller('AssetshowCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AssetshowCtrl.awesomeThings.length).toBe(3);
  });
});
