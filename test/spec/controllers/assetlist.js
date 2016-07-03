'use strict';

describe('Controller: AssetlistCtrl', function () {

  // load the controller's module
  beforeEach(module('theVarApp'));

  var AssetlistCtrl,
    scope, AssetsM;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, Assets) {
    scope = $rootScope.$new();
    AssetlistCtrl = $controller('AssetlistCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
    AssetsM=Assets;
    var aaa = {
      'source1': {
        'symbol1': 123,
        'symbol2': 456
      },
      'source2': {
        'symbol3': 123,
        'symbol4': 456
      }
    };
    AssetsM.setAAA(aaa);
  }));

  it('list should flatten', function () {
    expect(scope.list().length).toBe(4);
  });

  it('nport should return 0 for non-existing', function () {
    expect(scope.nport('source3','bla')).toBe(0);
  });

});
