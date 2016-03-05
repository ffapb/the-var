'use strict';

/**
 * @ngdoc function
 * @name theVarApp.controller:AssetAddCtrl
 * @description
 * # AssetAddCtrl
 * Controller of the theVarApp
 */
angular.module('theVarApp')
  .controller('AssetAddCtrl', function ($scope,varCalc,markitOnDemand,Portfolios,$routeParams,Assets) {

    // same code in portfolioshow
    var pid = $routeParams.pid;
    var pl = Portfolios.list();
    if(!pl.hasOwnProperty(pid)) {
      window.location.href='#/portfolioList';
      console.error('Invalid portfolio id '+pid);
      return;
    }
    $scope.portfolio = pl[pid];
    // end same code

    $scope.add2 = function() {
      Portfolios.addAsset(pid,$scope.pendingStock);
      $scope.pendingStock=false;
      window.location.href='#/portfolioShow/'+pid;
    };

    $scope.exists=function() {
      if(!$scope.asyncSelected) {
        return false;
      }
      return $scope.portfolio.hasOwnProperty($scope.asyncSelected.Symbol);
    };

    $scope.pendingStock=false;

    $scope.add1=function() {
      $scope.pendingStock={
        lookup: $scope.asyncSelected
      };
      $scope.getChart($scope.asyncSelected.Symbol, function() {
        $scope.pendingStock.portfolios = [$routeParams.pid];
        $scope.pendingStock.src='mod';

        Assets.add($scope.pendingStock);
        $scope.pendingStock=false;
        var sss = $scope.asyncSelected.Symbol;
        $scope.asyncSelected=null;
        window.location.href='#/assetShow/mod/'+sss;

      });
    };

    $scope.getSymbol = function(val) {
      return markitOnDemand.lookup(val);
    };

    $scope.modelOptions = {
      debounce: {
        default: 500,
        blur: 250
      },
      getterSetter: true
    };

    $scope.getQuote = function(val) {
      return markitOnDemand.quote(val);
    };

    $scope.getChart = function(symbol,cb) {
      return markitOnDemand.interactiveChart(symbol).then(function(response){
        if(response.data.Elements.length===0) {
          window.alert('No data');
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

        if(cb) { cb(); }

      });
    };

    $scope.showChart=function(p) {
      console.log(p);
    };

    $scope.calculateVaR = function(p,percentile) {
      return varCalc.calculateVaR(p,percentile);
    };

    $scope.clearAll=function() {
       localStorage.clear();
    };

    $scope.edf = function(data,ss) {
      return varCalc.edf(data,ss);
    };

    $scope.remove=function(p) {
      delete $scope.portfolio[p.lookup.Symbol];
    };

  });
