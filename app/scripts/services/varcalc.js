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
      calculateVaR: function(p,percentile,nday) {
        if(!p.history2) { return; }
        if(p.history2.length===0) { return; }
        if(nday<=0) { return; }

        // calculate n-day returns (including 1-day)
        var pnls =[];
        //pnls.push(0);
        for(var i=1;i<p.history2.length;i++) {
          if ( ( i % nday ) === 0 ) {
            pnls.push((p.history2[i]/p.history2[i-nday]-1)); // to be able to compare /nday
          }
        }

        if(pnls.length===0) { return; }

        pnls.sort(function(a,b) {
          return a-b;
        });

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
        // find the minimum bin edge
        var m1 = d2.reduce(function(a,b) {
          return Math.min(a,b);
        }, 99999999);
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
        // convert to percentages of the total count
        var op = ou.map(function(x) { return x/d2.length*100; });
  /*      for(i=1;i<op.length;i++) {
          op[i]+=op[i-1];
        }*/
        return op;
      },

      portfolioVaR: function(percentile,portfolio,nday) {
        if(!portfolio) { return; }
        if(!nday || nday<=0) { return; }

        var portSelKeys = Object.keys(portfolio).filter(function(x) {
          return !!portfolio[x].selected;
        });
        if(portSelKeys.length===0) { return 0; }

        var totalPct = portSelKeys.map(function(k) {
          return Math.abs(portfolio[k].pct);
        }).reduce(function(a,b) {
          if(b) { return a+b; } else { return a; }
        }, 0);

        // multiply pnls by weights of assets
        var pnlsWeighted = portSelKeys.map(function(k) {
          if(!portfolio[k].pct||!totalPct) {
            return [];
          } else {
            // This was the 1st implementation
            // https://gist.github.com/deenar/f97d517d3188fc7b5302
            //return portfolio[k].pnlsSort.map(function(y) {
            //  return y*portfolio[k].pct/totalPct;
            //});

            return portfolio[k].pnls.map(function(y) {
              var o = y*portfolio[k].pct/totalPct;
              return o;
            });
          }
        });
        // add pnls
        var pnlsTotal = pnlsWeighted.reduce(function(a,b) {
          if(!a) { return b; }
          if(!a.length) { return b; }
          if(!b) { return a; }
          if(!b.length) { return a; }

          // This was the 1st implementation
          // It's incorrect for portfolios since the weighting before the sorting reduces the VaR for no adequate reason
          // return $.merge(a,b);

          if(a.length!==b.length) {
            console.error('Cannot add pnls of different lengths',a.length,b.length);
            return a;
          }

          var o=[];
          for(var i=0;i<a.length;i++) {
            o.push(a[i]+b[i]);
          }
          return o;
        }, []);

        if(!pnlsTotal) { return 0; }
        if(!pnlsTotal.length) { return 0; }

        // construct hypothetical re-based prices for portfolio from pnlsTotals
        pnlsTotal = this.pnls2prices(pnlsTotal);

        return this.calculateVaR({history2: pnlsTotal}, percentile,nday);
      }, // end of function

      pnls2prices: function(pnls) {
        // construct hypothetical re-based prices for portfolio from pnlsTotals
        return pnls.map(function(x) {
          return 1+x;
        }).reduce(function(a,b) {
          // cumulative product
          a.push(a[a.length-1]*b);
          return a;
        },[100]); //.map(function(x) { return x*100; });
      } // end of function

    }; // end of class return
  }); // end of service
