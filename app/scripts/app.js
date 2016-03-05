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
    'ui.bootstrap'
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
      .when('/portfolioShow/:pid/assetAdd', {
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
      .otherwise({
        redirectTo: '/'
      });
  });

