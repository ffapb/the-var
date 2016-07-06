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
    'base64',
    'ui.chart',
    'angularMoment'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/assetAdd', {
        templateUrl: 'views/assetAdd.html',
        controller: 'AssetAddCtrl',
        controllerAs: 'assetAdd'
      })
      .when('/portfolioList', {
        templateUrl: 'views/portfoliolist.html',
        controller: 'PortfoliolistCtrl',
        controllerAs: 'portfolioList'
      })
      .when('/portfolioAdd', {
        templateUrl: 'views/portfolioadd.html',
        controller: 'PortfolioaddCtrl',
        controllerAs: 'portfolioAdd'
      })
      .when('/portfolioShow/:pid', {
        templateUrl: 'views/portfolioshow.html',
        controller: 'PortfolioshowCtrl',
        controllerAs: 'portfolioShow'
      })
      .when('/assetShow/:src/:symbol', {
        templateUrl: 'views/assetshow.html',
        controller: 'AssetshowCtrl',
        controllerAs: 'assetShow'
      })
      .when('/assetList', {
        templateUrl: 'views/assetlist.html',
        controller: 'AssetlistCtrl',
        controllerAs: 'assetList'
      })
      .when('/Settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'Settings'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

