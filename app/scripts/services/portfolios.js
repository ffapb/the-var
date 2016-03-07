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
          ppp[pid].assets=[];
        }
        if(ppp[pid].assets.filter(function(x) {
          return x.src===aaa.src && x.symbol===aaa.lookup.Symbol;
        }).length===0) {
          ppp[pid].assets.push({src:aaa.src,symbol:aaa.lookup.Symbol});
          this.saveToLs();
        }
      },
      rmAsset: function(pid,aaa) {
        if(!ppp.hasOwnProperty(pid)) {
          console.error('Invalid portfolio ID '+pid);
          return false;
        }

        var nu = ppp[pid].assets.filter(function(x) {
          return x.src!==aaa.src || x.symbol!==aaa.lookup.Symbol;
        });
        ppp[pid].assets = nu;
        this.saveToLs();
      },
      holdingAsset: function(src,symbol,inverse) {
        return Object.keys(ppp).filter(function(pid) {
          if(!ppp[pid].hasOwnProperty('assets')) {
            if(!inverse) { return false; } else { return true; }
          }
          var o = ppp[pid].assets.filter(function(x) {
            return x.src===src && x.symbol===symbol;
          }).length > 0;
          if(!inverse) { return o; } else { return !o; }
        }).map(function(x) {
          return ppp[x];
        });
      }
    };
  });