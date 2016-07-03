'use strict';

describe('Controller: AssetAddCtrl', function () {

  // load the controller's module
  beforeEach(module('theVarApp'));

  var AssetAddCtrl,
    scope, location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $location) {
    scope = $rootScope.$new();
    AssetAddCtrl = $controller('AssetAddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
    location=$location;
  }));

  it('after add1 should change location', function () {
    scope.asyncSelected={'Symbol':'bla'};
    scope.add1();
    expect(decodeURIComponent(location.url())).toBe('/assetShow/mod/bla');
  });
});
