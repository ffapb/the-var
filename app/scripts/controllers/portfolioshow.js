'use strict';

/**
 * @ngdoc function
 * @name theVarApp.controller:PortfolioshowCtrl
 * @description
 * # PortfolioshowCtrl
 * Controller of the theVarApp
 */
angular.module('theVarApp')
  .controller('PortfolioshowCtrl',
  function ($scope,Portfolios,$routeParams,varCalc) {

    var pid = $routeParams.pid;
    var pl = Portfolios.list();
    if(!pl.hasOwnProperty(pid)) {
      window.location.href='#/portfolioList';
      console.error('Invalid portfolio id '+pid);
      return;
    }
    $scope.portfolio = pl[pid];

    $scope.list = function() {
      var a = $scope.portfolio.assets;
      if(!a) {
        return false;
      }
      return a;
    };

    $scope.calculateVaR = function(p,percentile) {
      return varCalc.calculateVaR(p,percentile);
    };

    $scope.edf = function(data,ss) {
      return varCalc.edf(data,ss);
    };

    $scope.portfolioVaR=function(percentile) {
      return varCalc.portfolioVaR(percentile,$scope.portfolio);
    };

  });
