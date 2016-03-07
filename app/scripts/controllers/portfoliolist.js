'use strict';

/**
 * @ngdoc function
 * @name theVarApp.controller:PortfoliolistCtrl
 * @description
 * # PortfoliolistCtrl
 * Controller of the theVarApp
 */
angular.module('theVarApp')
  .controller('PortfoliolistCtrl', function ($scope, Portfolios, ActivateNavBar, Assets, varCalc) {

    ActivateNavBar.portfolios();

    $scope.np = function() {
      return Portfolios.np();
    };

    $scope.list=function() {
      return Portfolios.list();
    };

    $scope.nass=function(id) {
      var a = Portfolios.list();
      if(!a.hasOwnProperty(id)) {
        return 0;
      }
      a=a[id];
      if(!a.hasOwnProperty('assets')) {
        return 0;
      }
      a=a.assets;
      return Object.keys(a).length;
    };

    $scope.portfolioVaR=function(percentile, portfolio) {
      var a = portfolio.assets;
      if(!a) {
        return 0;
      }
      var al = Assets.list();
      var o = a.map(function(x) {
        if(al.hasOwnProperty(x.src)) {
          if(al[x.src].hasOwnProperty(x.symbol)) {
            return al[x.src][x.symbol];
          }
        }
        return null;
      }).filter(function(x) { return !!x; });

      return varCalc.portfolioVaR(percentile,o);
    };

   
  });
