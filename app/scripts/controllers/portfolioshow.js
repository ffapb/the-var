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
            var o2 = al[x.src][x.symbol];
            o2.pct = x.pct;
            return o2;
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

    $scope.delAsset = function(a) {
      if(window.confirm('Are you sure you want to delete the asset from the portfolio?')) {
        Portfolios.rmAsset(pid,a);
        $scope.portfolio = Portfolios.list()[pid];
        $scope.alist = $scope.list();
      }
    };

    $scope.delPortfolio=function() {
      if(window.confirm('Are you sure you want to delete the portfolio?')) {
        Portfolios.del(pid);
        window.location.href='#/portfolioList';
      }
    };

    $scope.assetPct=function(a) {
      Portfolios.assetPct(pid,a);
    };

    $scope.updateName=function() {
      Portfolios.updateName($scope.portfolio.id,$scope.portfolio.name);
    };

  });
