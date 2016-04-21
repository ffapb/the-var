'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('theVarApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('number of portfolios non-negative', function () {
    expect(scope.np().length).not.toBeLessThan(0);
  });
});
