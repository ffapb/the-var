'use strict';

/**
 * @ngdoc function
 * @name theVarApp.controller:AssetshowCtrl
 * @description
 * # AssetshowCtrl
 * Controller of the theVarApp
 */
angular.module('theVarApp')
  .controller('AssetshowCtrl', function ($routeParams,markitOnDemand,varCalc,Assets,$scope,Portfolios,ActivateNavBar,ffa) {

    ActivateNavBar.assets();

    var symbol = $routeParams.symbol;
    var src = $routeParams.src;

    $scope.goback=function() {
      if($routeParams.pid) {
        window.location.href='#/portfolioShow/'+$routeParams.pid;
      }
    };

    $scope.pendingStock=false;

    var al = Assets.list();
    if(al.hasOwnProperty(src)) {
      if(al[src].hasOwnProperty(symbol)) {
        $scope.pendingStock = al[src][symbol];
      }
    }

    $scope.add1=function() {
     markitOnDemand
      .lookup(symbol)
      .then(function(response) {
        var asyncSelected=response.filter(function(x) { return x.Symbol===symbol; });
        if(asyncSelected.length===0) {
          console.error('Couldnt identify symbol');
          return;
        }
        asyncSelected=asyncSelected[0]; // selecting first only
        $scope.pendingStock={
          src: src,
          lookup: asyncSelected
        };
        $scope.getChart();
      });
    };

    if(!$scope.pendingStock) { $scope.add1(); }

    $scope.getPid = function() { return $routeParams.pid; };

    $scope.add2 = function(pid) {
      Assets.add($scope.pendingStock);
      Portfolios.addAsset(pid,$scope.pendingStock);
      $scope.pendingStock=false;
      $scope.asyncSelected=null;
      window.location.href='#/portfolioShow/'+pid;
    };

    $scope.noPortfolios=function() {
      return Portfolios.np()===0;
    };

    $scope.inPortfolios=function(inverse) {
      if(!$scope.pendingStock || $scope.noPortfolios()) { return []; }
      return Portfolios.holdingAsset(src,symbol,inverse);
    };

    $scope.gcs=function() { return Assets.getGcs(); };

    $scope.getChart = function() {
      var fc = ffa.ffaConfig1();
      if(!!fc) {
        fc.then(function(config) {
          console.log('conf',config);
          $scope.getChartCore(config);
        });
      } else {
        $scope.getChartCore(false);
      }
    };

    $scope.getChartCore=function(config) {
      Assets.getChart(src,symbol,config)
        .then(function(ps) {
          // http://stackoverflow.com/a/171256/4126114
          for(var attrname in ps) {
            $scope.pendingStock[attrname] = ps[attrname];
          }
        });
    };

    $scope.showChart=function(p) {
      console.log(p);
    };

    $scope.calculateVaR = function(p,percentile) {
      return varCalc.calculateVaR(p,percentile);
    };

    $scope.edf = function(data,ss) {
      return varCalc.edf(data,ss);
    };

  });
