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
        var url = '#/assetShow/'+src+'/'+sss+'?pid='+$routeParams.pid;
        window.location.href=url;
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

    $scope.clearAll=function() {
       localStorage.clear();
    };

  });
