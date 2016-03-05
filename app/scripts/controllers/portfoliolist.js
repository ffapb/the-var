'use strict';

/**
 * @ngdoc function
 * @name theVarApp.controller:PortfoliolistCtrl
 * @description
 * # PortfoliolistCtrl
 * Controller of the theVarApp
 */
angular.module('theVarApp')
  .controller('PortfoliolistCtrl', function ($scope,Portfolios) {

    $scope.np = function() {
      return Portfolios.np();
    };

    $scope.list=function() {
      return Portfolios.list();
    };

    $scope.del=function(id) {
      Portfolios.del(id);
    };

    $scope.nass=function(id) {
      var a = Portfolios.list();
      if(!a.hasOwnProperty(id)) {
        return 0;
      }
      a=a[id];
      if(!a.hasOwnProperty('assets')) {
        return 0;
      }
      a=a.assets;
      return Object.keys(a).length;
    };
  });
