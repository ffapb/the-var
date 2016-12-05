'use strict';

/**
 * @ngdoc service
 * @name theVarApp.Portfolios
 * @description
 * # Portfolios
 * Service in the theVarApp.
 */
angular.module('theVarApp')
  .service('Portfolios', function (Assets) {
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
        var newP={name:name,src:src,assets:assets,cash:0,value:0};
        if(!name || !src) {
          console.error('Adding invalid portfolio '+angular.toJson(newP));
          return false;
        }
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
          // drop existing and replace with new
          ppp[found[0]].assets = angular.fromJson(angular.toJson(newP.assets));
          this.updateValue(ppp[found[0]].id);
          this.saveToLs();
          // just return id
          return ppp[found[0]].id;
        }
   
        ppp[newP.id] = angular.fromJson(angular.toJson(newP));
        this.updateValue(newP.id);
        this.saveToLs();
        return newP.id;
      },
      del: function(id) {
        delete ppp[id];
        this.saveToLs();
      },
      saveToLs: function() {
        localStorage.setItem('ppp',angular.toJson(ppp));
      },
      clear: function() {
        localStorage.removeItem('ppp');
        ppp={};
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
          ppp[pid].assets.push({
            src:aaa.src,
            symbol:aaa.lookup.Symbol,
            qty:0,
            pct:0
          });
          this.updateAsset(pid,aaa);
          this.updateValue(pid);
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
        this.updateValue(pid);
        this.saveToLs();
      },

      holdingAsset: function(src,symbol,inverse) {
        var self = this;
        return Object.keys(ppp).filter(function(pid) {
          if(!ppp[pid].hasOwnProperty('assets')) {
            console.error('portfolio missing assets field');
            if(!inverse) { return false; } else { return true; }
          }
          var alist = self.listAssets(pid);
          var o = alist.filter(function(x) {
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
      updateAsset: function(pid,aaa) {
        if(!ppp.hasOwnProperty(pid)) {
          console.error('Invalid portfolio ID '+pid);
          return false;
        }

        var self = this;
        var alist = Assets.list();
        ppp[pid].assets = ppp[pid].assets.map(function(x) {
          if(x.src===aaa.src && x.symbol===aaa.lookup.Symbol) {
            x.qty = aaa.qty?aaa.qty:0;
            x.historyMeta = alist[aaa.src][aaa.lookup.Symbol].historyMeta;
          }
          return x;
        });

        this.updateValue(pid);

        // now that the portfolio value is calculated, we can calculate the asset percentage
        ppp[pid].assets = ppp[pid].assets.map(function(x) {
          if(x.src===aaa.src && x.symbol===aaa.lookup.Symbol) {
            // add a pct field for varmatrix and varcalc directives as well as other calculations
            x.pct = self.qty2pct(x,ppp[pid]);
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
      },
      updateCash: function(pid,cash) {
        if(!ppp.hasOwnProperty(pid)) {
          console.error('Invalid portfolio ID '+pid);
          return false;
        }

        ppp[pid].cash=cash;

        this.updateValue(pid);
        var self = this;
        this.listAssets(pid).filter(function(x) {
          x.lookup={Symbol:x.symbol};
          self.updateAsset(pid,x); // to get the pct field updated
        });
        this.saveToLs();
      },

      updateValue: function(pid) {
        if(!ppp.hasOwnProperty(pid)) {
          console.error('Invalid portfolio ID '+pid);
          return false;
        }

        // get assets worth
        var self = this;
        var alist = this.listAssets(pid);
        var assetsValue = alist
          .map(function(a) {
            return self.qty2usd(a);
          })
          .reduce(function(a,b) { return a+b; },0);

        ppp[pid].value = ppp[pid].cash + assetsValue;
      },

      listAssets: function(pid) {
        if(!ppp.hasOwnProperty(pid)) {
          console.error('listAssets: Invalid portfolio ID '+pid);
          return [];
        }

        var a = ppp[pid].assets;
        if(!a) { return []; }
        var al = Assets.list();
        var o = a.map(function(x) {
          if(al.hasOwnProperty(x.src)) {
            if(al[x.src].hasOwnProperty(x.symbol)) {
              var o2 = al[x.src][x.symbol];
              o2.src=x.src;
              o2.symbol=x.symbol;
              o2.qty = x.qty;
              o2.pct = x.pct;
              return o2;
            }
          }
          return null;
        }).filter(function(x) { return !!x; });
        return o;
      },

      qty2pct: function(a,portfolio) {
        if(!portfolio) {
          console.error('portfolio argument undefined. Aborting');
          return 0;
        }

        if(!portfolio.value) {
          console.error('No portfolio value available in qty2pct. Aborting');
          return 0;
        }

        return this.qty2usd(a)/portfolio.value*100;
      },

      qty2usd: function(a) {
        if(!a.historyMeta) {
          // console.error('No price history available in qty2pct. Aborting: ',a);
          return 0;
        }

        return a.qty*a.historyMeta.lastprice;
      },

      unallocated: function(pid) {
        if(!pid) {
          return false;
        }
        if(!ppp.hasOwnProperty(pid)) {
          console.error('unallocated: Invalid portfolio ID '+pid);
          return false;
        }

        // 2016-11-10: cannot just do ppp[pid].assets, because it doesnt get the extra info in Assets class
        // var alist = ppp[pid].assets;
        var alist = this.listAssets(pid);
        alist = alist.map(function(a) { return a.pct; });
        return 100-alist.reduce(function(a,b) { return a+b; },0);
      }

    };
  });
