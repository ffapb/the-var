'use strict';

/**
 * @ngdoc service
 * @name theVarApp.Assets
 * @description
 * # Assets
 * Service in the theVarApp.
 */
angular.module('theVarApp')
  .service('Assets', function (markitOnDemand,ffahistory,varCalc) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var aaa={};
    if(localStorage.getItem('aaa')) {
      aaa = angular.fromJson(localStorage.getItem('aaa'));
    }

    var gcs=0;
    var pendingStock=false;

    return {
      add: function(x) {
        if(!aaa.hasOwnProperty(x.src)) { aaa[x.src]={}; }
        if(aaa[x.src].hasOwnProperty(x.lookup.Symbol)) {
          console.error('Assets already contain '+x.src+' '+x.lookup.Symbol);
        } else {
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
      },

      getChart: function(src,symbol,cb) {
        if(!aaa.hasOwnProperty(src)) {
          return;
        }

        if(!aaa[src].hasOwnProperty(symbol)) {
          return;
        }

        gcs=1;
        pendingStock = angular.copy(aaa[src][symbol]);
        if(src==='mod') {
          return markitOnDemand.interactiveChart(symbol).then(
            function(response) {
              this.treatChart(response,cb);
            },
            function() {
              gcs=2;
            }
          );
        } else if(src==='FFA MF') {
          return ffahistory.getHistory(
            symbol,
            this.treatChart,
            function() {
              gcs=2;
            }
          );
        } else {
          console.error('Unsupported source');
        }
      },

      treatChart: function(response,cb) {
        console.log('treat chart');
          gcs=0;
          console.log(response);
          if(response.data.Elements.length===0) {
            //window.alert('No data');
            return;
          }

          var dates = response.data.Dates;
          var prices = response.data.Elements[0].DataSeries.close.values;
          var o = [];
          for(var i=0;i<dates.length;i++) {
            o.push({'date':dates[i],'close':prices[i]});
          }
          pendingStock.history = o;
          pendingStock.history2 = angular.fromJson(angular.toJson(prices));
          pendingStock.historyMeta = {
            mindate: dates[0],
            maxdate: dates[dates.length-1]
          };

          var pnls = [];
          pnls.push(0);
          for(i=1;i<prices.length;i++) {
            pnls.push(prices[i]/prices[i-1]-1);
          }
          pendingStock.pnls=pnls;

          var pnlsSort = angular.fromJson(angular.toJson(pnls));
          pnlsSort.sort(function(a,b) {
            return a-b;
          });
          pendingStock.pnlsSort=pnlsSort;

          pendingStock.pnlsEdf=varCalc.edf(pnls,1/100);
          pendingStock.selected=true;

          cb(pendingStock);
      },

      getGcs: function() { return gcs; }


    };
  });
