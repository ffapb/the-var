'use strict';

/**
 * @ngdoc function
 * @name theVarApp.controller:AssetlistCtrl
 * @description
 * # AssetlistCtrl
 * Controller of the theVarApp
 */
angular.module('theVarApp')
  .controller('AssetlistCtrl', function ($scope,Assets,Portfolios,ActivateNavBar) {

    ActivateNavBar.assets();

    $scope.na = function() {
      return Assets.na();
    };

    $scope.list=function() {
      var al = Assets.list();
      // flatten
      var o = [];
      Object.keys(al).map(function(src) {
        Object.keys(al[src]).map(function(symbol) {
          o.push(al[src][symbol]);
        });
      });

      return o;
    };

    $scope.del=function(id) {
      Assets.del(id);
    };

    $scope.nport=function(src,symbol) {
      if(!Assets.exists(src,symbol)) { return 0; }

      // reverse lookup
      return Portfolios.holdingAsset(src,symbol).length;
    };
  });
