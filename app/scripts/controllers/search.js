'use strict';

/**
 * @ngdoc function
 * @name theVarApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the theVarApp
 */
angular.module('theVarApp')
  .controller('SearchCtrl', function ($scope,$http,localStorageService) {

    $scope.portfolio=null;
    $scope.pendingStock={};

    $scope.add=function() {
      var x = $scope.asyncSelected;
      if(!$scope.portfolio) {
        $scope.portfolio={};
      }
      if($scope.portfolio.hasOwnProperty(x.Symbol)) {
        return;
      }
      $scope.portfolio[x.Symbol] = {
        symbol: x,
        history: []
      };
      $scope.asyncSelected=null;
    };

    // Based on 
    // https://github.com/markitondemand/DataApis/blob/gh-pages/LookupSample/index.html
    // and http://angular-ui.github.io/bootstrap/ (scroll to typeahead)
    $scope.getSymbol = function(val) {
      // var url = 'http://dev.markitondemand.com/api/v2/Lookup/jsonp';
      var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp';

      return $http.jsonp(url, {
        params: {
          input: val,
          jsoncallback: 'JSON_CALLBACK'
        }
      }).then(function(response){
        return response.data;
      });
    };

    $scope.modelOptions = {
      debounce: {
        default: 500,
        blur: 250
      },
      getterSetter: true
    };

    $scope.getQuote = function(val) {
      var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp';

      return $http.jsonp(url, {
        params: {
          symbol: val.symbol.Symbol,
          jsoncallback: 'JSON_CALLBACK'
        }
      }).then(function(response){
        console.log('done',response);
        return response.data;
      });
    };

    $scope.getChart = function(val) {
      var url = 'http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/jsonp';

      return $http.jsonp(url, {
        params: {
          parameters: {
            DataPeriod: 'Month',
            NumberOfDays: 365,
            Normalized: true,
            Elements: [
              {
                Symbol: val.symbol.Symbol,
                Type: 'price',
                Params: ['c'],
              }
            ]
          },
          jsoncallback: 'JSON_CALLBACK'
        }
      }).then(function(response){
        console.log('done',response);
        var dates = response.data.Dates;
        var prices = response.data.Elements[0].DataSeries.close.values;
        var o = [];
        for(var i=0;i<dates.length;i++) {
          o.push({'date':dates[i],'close':prices[i]});
        }
        $scope.portfolio[val.symbol.Symbol].history = o;
      });
    };

    $scope.unbind = null;
    angular.element(document).ready(function () {
      if(localStorageService.isSupported) {
        var lsKeys = localStorageService.keys();
        if(lsKeys.indexOf("portfolio")!=-1) {
          $scope.portfolio = localStorageService.get("portfolio");
        }
        $scope.unbind = localStorageService.bind($scope, "portfolio");
      }
    });

    $scope.showChart=function(p) {
      console.log(p.history);
    };

  });
