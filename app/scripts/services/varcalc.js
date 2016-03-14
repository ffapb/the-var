'use strict';

/**
 * @ngdoc service
 * @name theVarApp.varCalc
 * @description
 * # varCalc
 * Service in the theVarApp.
 */
angular.module('theVarApp')
  .service('varCalc', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      // https://gist.github.com/deenar/f97d517d3188fc7b5302
      calculateVaR: function(p,percentile) {
        if(!p.pnlsSort) {
          return;
        }
        if(p.pnlsSort.length===0) {
          return;
        }

        var pnls = p.pnlsSort;
        var size = pnls.length;
        var indexR = (size * ((100 - percentile) / 100)) - 1;
        var upper = Math.min(size-1,Math.max(0,Math.ceil(indexR)));
        var lower = Math.min(size-1,Math.max(0,Math.floor(indexR)));
        if (lower === upper) {
          return pnls[upper];
        } else { /* interpolate if necessary */
          return ((upper - indexR) * pnls[lower]) + ((indexR - lower) * pnls[upper]);
        }
      },
      edf: function(data,ss) {
        // data: [5,5.2,5.1,6,7,8.2,8.4,8.2]
        // ss: step size: 1
        var d2 = angular.fromJson(angular.toJson(data));
        d2.sort(function(a,b) {
          return a-b;
        });
        var m1 = d2.reduce(function(a,b) {
          if(a<b) { return a; }
          return b;
        }, 9999); // get array minimum
        m1 = Math.floor(m1/ss)*ss;
        var o = d2.map(function(x) { return Math.floor((x-m1)/ss); });
        var ou = [];
        var od = [];
        for(var i=0;i<o.length;i++) {
          var sgn=1;
          if(d2[i]<0) {
            sgn=-1;
          }

          if(od.indexOf(o[i])===-1) {
            ou.push(sgn);
            od.push(o[i]);
          } else {
            ou[ou.length-1]+=sgn;
          }
        }
        var op = ou.map(function(x) { return x/d2.length*100; });
  /*      for(i=1;i<op.length;i++) {
          op[i]+=op[i-1];
        }*/
        return op;
      },
      // https://gist.github.com/deenar/f97d517d3188fc7b5302
      portfolioVaR: function(percentile,portfolio) {
        if(!portfolio) {
          return;
        }

        var totalPct = Object.keys(portfolio).filter(function(x) {
          return portfolio[x].selected;
        }).map(function(k) {
          return Math.abs(portfolio[k].pct);
        }).reduce(function(a,b) {
          if(b) { return a+b; } else { return a; }
        }, 0);

        var pnls = Object.keys(portfolio).filter(function(x) {
          return portfolio[x].selected;
        }).map(function(k) {
          if(!portfolio[k].pct||!totalPct) {
            return [];
          } else {
            return portfolio[k].pnlsSort.map(function(y) {
              return y*portfolio[k].pct/totalPct;
            });
          }
        }).reduce(function(a,b) {
          if(b) {
            return $.merge(a,b);
          } else {
            return a;
          }
        }, []);
        if(!pnls.length) { return 0; }
        pnls.sort(function(a,b) {
            return a-b;
          });
        return this.calculateVaR({pnlsSort: pnls}, percentile);
      }
    };
  });
