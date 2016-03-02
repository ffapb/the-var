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
            DataPeriod: 'Day', // Month
            NumberOfDays: 365,
            Normalized: false, // until I understand how they're normalizing, I'm just using the close prices
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
        var dates = response.data.Dates;
        var prices = response.data.Elements[0].DataSeries.close.values;
        var o = [];
        for(var i=0;i<dates.length;i++) {
          o.push({'date':dates[i],'close':prices[i]});
        }
        $scope.portfolio[val.symbol.Symbol].history = o;
        $scope.portfolio[val.symbol.Symbol].history2 = angular.fromJson(angular.toJson(prices));

        var pnls = [];
        pnls.push(0);
        for(i=1;i<prices.length;i++) {
          pnls.push(prices[i]/prices[i-1]-1);
        }
        $scope.portfolio[val.symbol.Symbol].pnls=pnls;

        var pnlsSort = angular.fromJson(angular.toJson(pnls));
        pnlsSort.sort(function(a,b) {
          return a-b;
        });
        $scope.portfolio[val.symbol.Symbol].pnlsSort=pnlsSort;

        $scope.portfolio[val.symbol.Symbol].pnlsEdf=$scope.edf(pnls,1/100);
      });
    };

    $scope.unbind = null;
    angular.element(document).ready(function () {
      if(localStorageService.isSupported) {
        var lsKeys = localStorageService.keys();
        if(lsKeys.indexOf('portfolio')!==-1) {
          $scope.portfolio = localStorageService.get('portfolio');
        }
        $scope.unbind = localStorageService.bind($scope, 'portfolio');
      }
    });

    $scope.showChart=function(p) {
      console.log(p);
    };

    // https://gist.github.com/deenar/f97d517d3188fc7b5302
    $scope.calculateVaR=function(p,percentile) {
      if(!p.pnls) {
        return;
      }
      if(p.pnls.length===0) {
        return;
      }

      var pnls = p.pnlsSort;
      var size = pnls.length;
      var indexR = (size * ((100 - percentile) / 100)) - 1;
      var upper = Math.min(size-1,Math.max(0,Math.ceil(indexR)));
      var lower = Math.min(size-1,Math.max(0,Math.floor(indexR)));
      if (lower === upper) {
        return pnls[upper];
      } else { /* interpolate if necessary */
        return ((upper - indexR) * pnls[lower]) + ((indexR - lower) * pnls[upper]);
      }
    };

    $scope.clearAll=function() {
       return localStorageService.clearAll();
    };

    $scope.edf = function(data,ss) {
      // data: [5,5.2,5.1,6,7,8.2,8.4,8.2]
      // ss: step size: 1
      var d2 = angular.fromJson(angular.toJson(data));
      d2.sort(function(a,b) {
        return a-b;
      });
      var m1 = d2.reduce(function(a,b) {
        if(a<b) { return a; }
        return b;
      }, 9999); // get array minimum
      m1 = Math.floor(m1/ss)*ss;
      var o = d2.map(function(x) { return Math.floor((x-m1)/ss); });
      console.log(ss,d2,m1,o);
      var ou = [];
      var od = [];
      for(var i=0;i<o.length;i++) {
        var sgn=1;
        if(d2[i]<0) {
          sgn=-1;
        }

        if(od.indexOf(o[i])===-1) {
          ou.push(sgn);
          od.push(o[i]);
        } else {
          ou[ou.length-1]+=sgn;
        }
      }
      var op = ou.map(function(x) { return x/d2.length*100; });
/*      for(i=1;i<op.length;i++) {
        op[i]+=op[i-1];
      }*/
      return op;
    };

  });
