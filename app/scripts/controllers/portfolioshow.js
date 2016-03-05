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
  function ($scope,Portfolios,$routeParams,varCalc,Assets,ActivateNavBar) {

    ActivateNavBar.portfolios();

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
      var al = Assets.list();
      var o = a.map(function(x) {
        if(al.hasOwnProperty(x.src)) {
          if(al[x.src].hasOwnProperty(x.symbol)) {
            return al[x.src][x.symbol];
          }
        }
        return null;
      }).filter(function(x) { return !!x; });
      return o;
    };

    $scope.alist = $scope.list();

    $scope.calculateVaR = function(p,percentile) {
      return varCalc.calculateVaR(p,percentile);
    };

    $scope.edf = function(data,ss) {
      return varCalc.edf(data,ss);
    };

    $scope.portfolioVaR=function(percentile) {
      return varCalc.portfolioVaR(percentile,$scope.alist);
    };

    $scope.remove = function(a) {
      Portfolios.rmAsset(pid,a);
      $scope.portfolio = Portfolios.list()[pid];
      $scope.alist = $scope.list();
    };

  });
