'use strict';

/**
 * @ngdoc service
 * @name theVarApp.ffahistory
 * @description
 * # ffahistory
 * Service in the theVarApp.
 */
angular.module('theVarApp')
  .service('ffahistory', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var config=null;
    return {
      // redefinition from service ffa
      ffaConfig1: function(cb) {
        $http.get('/the-var-config.json').then(function(response) {
          console.log('fc11',response.data);
          config = response.data;
          if(cb) { cb(); }
        }, function(response) {
          console.error('fc12',response);
        });
      },

      getHistory: function(symbol,f1,f2) {
          if(!config) {
            var self = this;
            this.ffaConfig1(function() { self.getHistory(symbol,f1,f2); });
            return;
          }

          var url = config.endPoints.prices+'?format=json&tkr=["'+symbol+'"]';
          return $http.get(url).then(f1,f2);
      }
    };
  });
