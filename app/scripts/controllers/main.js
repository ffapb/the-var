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

    $scope.activateNavBar=function() {
      $('.nav.navbar-nav > li').removeClass('active');
      $('.nav.navbar-nav > li:nth-child(2)').addClass('active');
    };

  });
