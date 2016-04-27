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
      set: function(xxx) { ppp=xxx; },
      list: function() {
        return ppp;
      },
      np: function() {
        return Object.keys(ppp).length;
      },
      add: function(src,name,assets) {
        if(!name || !src) {
          console.error('Adding invalid portfolio '+angular.toJson(newP));
          return false;
        }
        var newP={name:name,src:src,assets:assets};
        newP.id = this.newId();
        if(ppp.hasOwnProperty(newP.id)) {
          console.error('ID '+newP.id+' already exists');
          return false;
        }

        var found = Object.keys(ppp).filter(function(k) {
          return ppp[k].src===newP.src && ppp[k].name===newP.name;
        });
        if(found.length>0) {
          console.error('Portfolios already contain ',newP);
          return ppp[found[0]].id;
        }
   
        ppp[newP.id] = angular.fromJson(angular.toJson(newP));
        this.saveToLs();
        return newP.id;
      },
      del: function(id) {
        delete ppp[id];
        this.saveToLs();
      },
      saveToLs: function() {
        console.log('save to ls',ppp);
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
      },
      newId: function() {
        var id = 1;
        if(this.np()!==0) {
          var pl = this.list();
          id = Object.keys(pl).map(function(x) {
            return pl[x].id;
          });
          id=id.reduce(function(a,b) {
            if(a<b) {
              return b;
            }
            return a;
          });
          id=1+id;
        }
        return id;
      },
      assetPct: function(pid,aaa) {
        if(!ppp.hasOwnProperty(pid)) {
          console.error('Invalid portfolio ID '+pid);
          return false;
        }

        ppp[pid].assets = ppp[pid].assets.map(function(x) {
          if(x.src===aaa.src && x.symbol===aaa.lookup.Symbol) {
            x.pct = aaa.pct;
          }
          return x;
        });
        this.saveToLs();
      },
      updateName: function(pid,name) {
        if(!ppp.hasOwnProperty(pid)) {
          console.error('Invalid portfolio ID '+pid);
          return false;
        }

        ppp[pid].name=name;
        this.saveToLs();

      }
    };
  });
