'use strict';

/**
 * @ngdoc function
 * @name theVarApp.controller:PortfolioaddCtrl
 * @description
 * # PortfolioaddCtrl
 * Controller of the theVarApp
 */
angular.module('theVarApp')
  .controller('PortfolioaddCtrl', function ($scope,Portfolios,$location,ActivateNavBar,$http,$base64) {

    ActivateNavBar.portfolios();

    $scope.add = function() {
      if(!$scope.portfolios) {
        $scope.portfolios={};
      }

      $scope.newP.id = $scope.newId();
      if(Portfolios.add($scope.newP)) {
        window.location.href = '#/portfolioShow/'+$scope.newP.id;
      }
    };

    $scope.newId = function() {
      var id = 1;
      if(Portfolios.np()!==0) {
        var pl = Portfolios.list();
        id = Object.keys(pl).map(function(x) {
          return pl[x].id;
        });
        id=id.reduce(function(a,b) {
          if(a<b) {
            return b;
          }
          return a;
        });
        id=1+id;
      }
      return id;
    };


    $scope.exists = function() {
      if(!$scope.newP) { return false; }
      var pl = Portfolios.list();
      return Object.keys(pl).filter(function(x) { return pl[x].name===$scope.newP.name; }).length>0;
    };

    $scope.ffaConfig = function() {
      console.log('ffa config');
      var un = window.prompt('Username');
      if(un) {
        var pw = window.prompt('Password');
        if(pw) {
          var credentials = $base64.encode(un + ':' + pw);
          $http.get(
            '/ffa-mfe/the-var-config.json',
            {
              withCredentials: true,
              headers: { 'Authorization': 'Basic ' + credentials }
            }
            ).then(function(response) {
            if(response.status!==200) {
              console.error('FFA the-var config not found');
              return;
            }

            console.log('portfoliosEndPoint',response.data);
          }, function(response) {
            console.error('Search for FFA the-var failed. '+angular.toJson(response));
          });
        }
      }
    };
    $scope.ffaConfig();

  });
