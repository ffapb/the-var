'use strict';

/**
 * @ngdoc function
 * @name theVarApp.controller:AssetshowCtrl
 * @description
 * # AssetshowCtrl
 * Controller of the theVarApp
 */
angular.module('theVarApp')
  .controller('AssetshowCtrl', function ($routeParams,markitOnDemand,varCalc,Assets,$scope,Portfolios,ActivateNavBar) {

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

    $scope.gcs=0;
    $scope.getChart = function() {
      $scope.gcs=1;
      return markitOnDemand.interactiveChart(symbol).then(function(response){
        $scope.gcs=0;
        if(response.data.Elements.length===0) {
          //window.alert('No data');
          return;
        }

        var dates = response.data.Dates;
        var prices = response.data.Elements[0].DataSeries.close.values;
        var o = [];
        for(var i=0;i<dates.length;i++) {
          o.push({'date':dates[i],'close':prices[i]});
        }
        $scope.pendingStock.history = o;
        $scope.pendingStock.history2 = angular.fromJson(angular.toJson(prices));
        $scope.pendingStock.historyMeta = {
          mindate: dates[0],
          maxdate: dates[dates.length-1]
        };

        var pnls = [];
        pnls.push(0);
        for(i=1;i<prices.length;i++) {
          pnls.push(prices[i]/prices[i-1]-1);
        }
        $scope.pendingStock.pnls=pnls;

        var pnlsSort = angular.fromJson(angular.toJson(pnls));
        pnlsSort.sort(function(a,b) {
          return a-b;
        });
        $scope.pendingStock.pnlsSort=pnlsSort;

        $scope.pendingStock.pnlsEdf=$scope.edf(pnls,1/100);
        $scope.pendingStock.selected=true;

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
