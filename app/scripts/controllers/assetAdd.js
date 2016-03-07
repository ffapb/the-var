'use strict';

/**
 * @ngdoc function
 * @name theVarApp.controller:AssetAddCtrl
 * @description
 * # AssetAddCtrl
 * Controller of the theVarApp
 */
angular.module('theVarApp')
  .controller('AssetAddCtrl', function ($scope,varCalc,markitOnDemand,Portfolios,$routeParams) {

    $scope.pendingStock=false;

    $scope.add1=function() {
        var src='mod';
        var sss = $scope.asyncSelected.Symbol;
        $scope.asyncSelected=null;
        var url = '#/assetShow/'+src+'/'+sss;
        if($routeParams.pid) { url+='?pid='+$routeParams.pid; }
        window.location.href=url;
    };

    $scope.getSymbol = function(val) {
      $scope.pa=0;
      $scope.asyncSelected=null;
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

    $scope.gcs=0;
    $scope.pa=0;
    $scope.getChart = function() {
      if(!$scope.asyncSelected) { return; }
      var symbol=$scope.asyncSelected.Symbol;
      $scope.gcs=1;
      return markitOnDemand.interactiveChart(symbol).then(function(response){
        $scope.gcs=0;
        if(response.data.Elements.length===0) {
          //window.alert('No data');
          $scope.pa=1; // not avail
          return;
        }
        $scope.pa=2; // avail
      });
    };

  });
