'use strict';

/**
 * @ngdoc service
 * @name theVarApp.Assets
 * @description
 * # Assets
 * Service in the theVarApp.
 */
angular.module('theVarApp')
  .service('Assets', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var aaa={};
    if(localStorage.getItem('aaa')) {
      aaa = angular.fromJson(localStorage.getItem('aaa'));
    }

    return {
      add: function(x) {
        if(!aaa.hasOwnProperty(x.src)) { aaa[x.src]={}; }
        if(!aaa[x.src].hasOwnProperty(x.lookup.Symbol)) {
          aaa[x.src][x.lookup.Symbol] = x;
          this.saveToLs();
        }
      },
      list: function() {
        return aaa;
      },
      saveToLs: function() {
        localStorage.setItem('aaa',angular.toJson(aaa));
      },
      na: function() {
        return Object.keys(aaa).length;
      },
      del: function(src,symbol) {
        if(!this.exists(src,symbol)) { return; }
        delete aaa[src][symbol];
        if(Object.keys(aaa[src]).length===0) { delete aaa[src]; }
        this.saveToLs();
      },
      exists: function(src,symbol) {
        if(!aaa.hasOwnProperty(src)) { return false; }
        if(!aaa[src].hasOwnProperty(symbol)) { return false; }
        return true;
      }
    };
  });
