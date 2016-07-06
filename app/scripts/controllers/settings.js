'use strict';

/**
 * @ngdoc function
 * @name theVarApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the theVarApp
 */
angular.module('theVarApp')
  .controller('SettingsCtrl', function ($scope,Settings) {

    var ls = localStorage.getItem('settings');
    if(!!ls) {
      ls = angular.fromJson(ls);
      Settings.setEnd(ls.end);
      Settings.setLength(ls.length.n,ls.length.u);
    }

    $scope.get = function() { return Settings; };

    $scope.saveToLs = function() { 
      localStorage.setItem('settings',angular.toJson(Settings));
    };

  });
