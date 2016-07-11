'use strict';

/**
 * @ngdoc function
 * @name theVarApp.controller:AssetlistCtrl
 * @description
 * # AssetlistCtrl
 * Controller of the theVarApp
 */
angular.module('theVarApp')
  .controller('AssetlistCtrl', function ($scope,Assets,Portfolios,ActivateNavBar,AssetsRefresher) {

    ActivateNavBar.assets();

    $scope.na = function() {
      return Assets.na();
    };

    $scope.list=function() {
      return Assets.listFlat();
    };

    $scope.del=function(id) {
      Assets.del(id);
    };

    $scope.nport=function(src,symbol) {
      if(!Assets.exists(src,symbol)) { return 0; }

      // reverse lookup
      return Portfolios.holdingAsset(src,symbol).length;
    };

    $scope.assetsRefresher = AssetsRefresher;

  });
