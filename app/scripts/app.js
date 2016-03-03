'use strict';

/**
 * @ngdoc overview
 * @name theVarApp
 * @description
 * # theVarApp
 *
 * Main module of the application.
 */
angular
  .module('theVarApp', [
    'ngMessages',
    'ngRoute',
    'ui.bootstrap',
    'LocalStorageModule'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/assetAdd', {
        templateUrl: 'views/assetAdd.html',
        controller: 'AssetAddCtrl',
        controllerAs: 'assetAdd'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
