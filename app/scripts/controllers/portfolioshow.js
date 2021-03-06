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

    $scope.list = function() {
      var assets = Portfolios.listAssets($scope.portfolio.id);

      // sort by weight
      assets.sort(function(a,b) {
        return b.pct-a.pct;
      });

      return assets;
    };

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

    $scope.updateAsset=function(a) {
      Portfolios.updateAsset(pid,a);
    };

    $scope.qty2pct = function(a,portfolio) {
      return Portfolios.qty2pct(a,portfolio);
    };

    $scope.updateName=function() {
      Portfolios.updateName($scope.portfolio.id,$scope.portfolio.name);
    };

    $scope.updateCash=function() {
      Portfolios.updateCash($scope.portfolio.id,$scope.portfolio.cash);
    };

    $scope.unallocated = function() {
      return Portfolios.unallocated($scope.portfolio.id);
    };

    $scope.set=function(pid_) {
      pid = pid_;
      pl = Portfolios.list();
      if(!pl.hasOwnProperty(pid)) {
        window.location.href='#/portfolioList';
        console.error('portfolioshowctrl/set: Invalid portfolio id '+pid);
        return;
      }
      $scope.portfolio = pl[pid];
      // trigger a fake update for the pct values of assets to get updated
      $scope.updateCash();
      // get list
      $scope.alist = $scope.list();
    };

    if(!!$routeParams.pid) {
      $scope.set($routeParams.pid);
    }

  });
