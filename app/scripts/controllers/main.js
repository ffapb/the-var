'use strict';

/**
 * @ngdoc function
 * @name theVarApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the theVarApp
 */
angular.module('theVarApp')
  .controller('MainCtrl', function ($scope,Portfolios) {

    $scope.np = function() {
      return Portfolios.np();
    };

  });
