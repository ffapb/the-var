'use strict';

/**
 * @ngdoc function
 * @name theVarApp.controller:PortfolioaddCtrl
 * @description
 * # PortfolioaddCtrl
 * Controller of the theVarApp
 */
angular.module('theVarApp')
  .controller('PortfolioaddCtrl', function ($scope,Portfolios,$location) {
    $scope.add = function() {
      if(!$scope.portfolios) {
        $scope.portfolios={};
      }

      $scope.newP.id = $scope.newId();
      if(Portfolios.add($scope.newP)) {
        $location.url('portfolioList');
      }
    };

    $scope.newId = function() {
      var id = 1;
      if(Portfolios.np()!==0) {
        var pl = Portfolios.list();
        id = Object.keys(pl).map(function(x) {
          return pl[x].id;
        });
        id=id.reduce(function(a,b) {
          if(a<b) {
            return b;
          }
          return a;
        });
        id=1+id;
      }
      return id;
    };

  });
