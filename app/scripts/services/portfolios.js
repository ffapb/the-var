'use strict';

/**
 * @ngdoc service
 * @name theVarApp.Portfolios
 * @description
 * # Portfolios
 * Service in the theVarApp.
 */
angular.module('theVarApp')
  .service('Portfolios', function () {
    // AngularJS will instantiate a singleton by calling 'new' on this function

    var ppp = {};
    if(localStorage.getItem('ppp')) {
      ppp = angular.fromJson(localStorage.getItem('ppp'));
    }

    return {
      list: function() {
        if(this.np()===0) {
          return false;
        }
        return ppp;
      },
      np: function() {
        return Object.keys(ppp).length;
      },
      add: function(newP) {
        if(!newP.id || !newP.name) {
          console.error('Adding invalid portfolio '+angular.toJson(newP));
          return false;
        }
        if(ppp.hasOwnProperty(newP.id)) {
          console.error('ID '+newP.id+' already exists');
          return false;
        }
        ppp[newP.id] = angular.fromJson(angular.toJson(newP));
        this.saveToLs();
        return this;
      },
      del: function(id) {
        delete ppp[id];
        this.saveToLs();
      },
      saveToLs: function() {
        localStorage.setItem('ppp',angular.toJson(ppp));
      },
      addAsset: function(pid,aaa) {
        if(!ppp.hasOwnProperty(pid)) {
          console.error('Invalid portfolio ID '+pid);
          return false;
        }
        if(!ppp[pid].assets) {
          ppp[pid].assets={};
        }
        ppp[pid].assets[aaa.lookup.Symbol]=aaa;
        this.saveToLs();
        return this;
      }
    };
  });
