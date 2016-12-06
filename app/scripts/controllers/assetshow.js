'use strict';

/**
 * @ngdoc function
 * @name theVarApp.controller:AssetshowCtrl
 * @description
 * # AssetshowCtrl
 * Controller of the theVarApp
 */
angular.module('theVarApp')
  .controller('AssetshowCtrl', function ($routeParams,markitOnDemand,varCalc,Assets,$scope,Portfolios,ActivateNavBar,ffa,$location,$log) {

    ActivateNavBar.assets();

    $scope.pendingStock=false;
    var symbol,src;

    $scope.goback=function() {
      if($routeParams.pid) {
        $location.url('/portfolioShow/'+$routeParams.pid);
      }
    };

    $scope.set=function(s1,s2) {
      if(!s1||!s2) { return; }
      symbol = s1;
      src = s2;

      var al = Assets.list();
      if(al.hasOwnProperty(src)) {
        if(al[src].hasOwnProperty(symbol)) {
          $scope.pendingStock = al[src][symbol];
          return false;
        }
      }
      if(!$scope.pendingStock) { return $scope.add1(); }
      return false;
    };

    $scope.add1=function() {
      return markitOnDemand
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
          return $scope.getChart();
        });
    };

    $scope.set($routeParams.symbol,$routeParams.src);

    $scope.getPid = function() { return $routeParams.pid; };

    $scope.add2 = function(pid) {
      // not sure what this is for anymore
      //Assets.add($scope.pendingStock);
      Portfolios.addAsset(pid,$scope.pendingStock);
      $scope.pendingStock=false;
      $scope.asyncSelected=null;
      $location.url('/portfolioShow/'+pid); // do not use '#/portfoli...'
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
      if(src==='FFA MF') {
        var fc = ffa.ffaConfig1();
        if(!!fc) {
          fc.then(function(config) {
            $log.debug('conf',config);
            return $scope.getChartCore(config);
          });
        } else {
          console.error('Failed to get ffa config');
        }
      } else {
        return $scope.getChartCore(false);
      }
    };

    $scope.getChartCore=function(config) {
      return Assets.getChartAndUpdate($scope.pendingStock,config);
    };

    $scope.showChart=function(p) {
      $log.debug(p);
    };

    $scope.calculateVaR = function(p,percentile,nday) {
      return varCalc.calculateVaR(p,percentile,nday);
    };

    $scope.edf = function(data,ss) {
      return varCalc.edf(data,ss);
    };

    // http://www.jqplot.com/examples/date-axes.php
    $scope.myChartOpts={};
    $scope.myChartOpts.usd = {
      title:'Default Date Axis',
      axes:{
        xaxis:{
          renderer:$.jqplot.DateAxisRenderer,
          tickOptions:{formatString:'%Y-%m-%d'}
        },
        yaxis:{
          tickOptions:{formatString:'$%.2f'}
        }
      },
      highlighter: {
        show: true,
        sizeAdjust: 7.5
      },
      cursor: {
        show: true,
        showTooltip: false,
        zoom: true,
        looseZoom: true
      },
      series:[
        {
          lineWidth:1,
          shadow:false,
          showMarker: false
//          markerOptions:{style:'none'}
        }
      ]
    };
    $scope.myChartOpts.perc = angular.fromJson(angular.toJson($scope.myChartOpts.usd));
    $scope.myChartOpts.perc.axes.xaxis.renderer = $.jqplot.DateAxisRenderer;
    $scope.myChartOpts.perc.axes.yaxis.tickOptions.formatString='%%%.2f';

    $scope.myChartOpts.percBar = {
      seriesDefaults: {
        renderer: $.jqplot.BarRenderer,
        rendererOptions: {
          fillToZero: true,
          barWidth: 2,
          shadowAlpha: 0
        }
      }
    };

    $log.debug($scope.myChartOpts.perc);

  });
