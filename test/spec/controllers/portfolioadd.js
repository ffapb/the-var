'use strict';

describe('Controller: PortfolioaddCtrl', function () {

  // load the controller's module
  beforeEach(module('theVarApp'));

  var PortfolioaddCtrl, scope, location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $location, $window) {
    $window.localStorage.clear();
    scope = $rootScope.$new();
    PortfolioaddCtrl = $controller('PortfolioaddCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
    location=$location;
  }));

  it('exists on non-existing', function () {
    scope.newP={'name':'123'};
    expect(scope.exists()).toBe(false);
  });

  it('add on non-existing', function () {
    scope.newP={'name':'123'};
    var id=scope.add();
    expect(decodeURIComponent(location.url())).toBe('/portfolioShow/'+id);
  });

});
