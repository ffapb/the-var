'use strict';

/**
 * @ngdoc function
 * @name theVarApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the theVarApp
 */
angular.module('theVarApp')
  .controller('SettingsCtrl', function ($scope,Settings,$window) {

    $scope.get = function() { return Settings; };

    $scope.saveToLs = function() { 
      localStorage.setItem('settings',angular.toJson(Settings));
    };

    $scope.setEnd=function() {
      var type = Settings.end.type;
      var date = Settings.end.date;
      Settings.setEnd(type,date);
      $scope.saveToLs();
    };

    $scope.reset=function() {
      if(window.confirm('Are you sure you want to clear all your local data?')) {
        localStorage.clear();
        $window.location.reload();
      }
    };

  });
