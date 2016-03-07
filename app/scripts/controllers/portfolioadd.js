'use strict';

/**
 * @ngdoc function
 * @name theVarApp.controller:PortfolioaddCtrl
 * @description
 * # PortfolioaddCtrl
 * Controller of the theVarApp
 */
angular.module('theVarApp')
  .controller('PortfolioaddCtrl', function ($scope,Portfolios,$location,ActivateNavBar) {

    ActivateNavBar.portfolios();

    $scope.add = function() {
      if(!$scope.portfolios) {
        $scope.portfolios={};
      }

      if($scope.exists()) {
        console.error('Portfolio name already exists');
        return;
      }

      $scope.newP.src='Manual';
      if(Portfolios.add($scope.newP)) {
        window.location.href = '#/portfolioShow/'+$scope.newP.id;
      }
    };

    $scope.exists = function() {
      if(!$scope.newP) { return false; }
      var pl = Portfolios.list();
      return Object.keys(pl).filter(function(x) { return pl[x].name===$scope.newP.name; }).length>0;
    };

  });
