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

    var pid, pl;
    $scope.portfolio = null;
    $scope.alist=null;

    $scope.showNoData=true;

    $scope.set=function(pid_) {
      pid = pid_;
      pl = Portfolios.list();
      if(!pl.hasOwnProperty(pid)) {
        window.location.href='#/portfolioList';
        console.error('Invalid portfolio id '+pid);
        return;
      }
      $scope.portfolio = pl[pid];
      $scope.alist = $scope.list();
    };

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

    $scope.set($routeParams.pid);

    $scope.calculateVaR = function(p,percentile,nday) {
      return varCalc.calculateVaR(p,percentile,nday);
    };

    $scope.edf = function(data,ss) {
      return varCalc.edf(data,ss);
    };

    $scope.portfolioVaR=function(percentile,nday) {
      return varCalc.portfolioVaR(percentile,$scope.alist,nday);
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

    $scope.colorCondition=function(a,perc,nday) {
      if(!a.pnls) return 'grey';
      var v1=a.pnls[a.pnls.length-1];
      var v2=$scope.calculateVaR(a,perc,nday);
      if(v1>v2) return 'green';
      if(v1<v2) return 'red';
      return 'black';
    };

  });
