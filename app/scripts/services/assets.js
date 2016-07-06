'use strict';

/**
 * @ngdoc service
 * @name theVarApp.Assets
 * @description
 * # Assets
 * Service in the theVarApp.
 */
angular.module('theVarApp')
  .service('Assets', function (markitOnDemand,varCalc,$http) {
    // AngularJS will instantiate a singleton by calling 'new' on this function
    var aaa={};
    if(localStorage.getItem('aaa')) {
      aaa = angular.fromJson(localStorage.getItem('aaa'));
    }

    var gcs=0;

    return {
      setAAA: function(bbb) {
        aaa=bbb;
      },
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

      getChart: function(src,symbol,config) {
        console.log('Getting prices for '+src+': '+symbol); 
        gcs=1;
        var self=this;
        if(src==='mod') {
          return markitOnDemand.interactiveChart(symbol)
            .then(
              function(response) { gcs=0; return(self.treatChart(response.data)); },
              function() { gcs=2; }
            );
        } else if(src==='FFA MF') {
          var symbol2=symbol;
          if( typeof symbol !== 'string' && src==='FFA MF' && Object.prototype.toString.call(symbol) === '[object Array]' ) {
            symbol2=symbol.join('','');
          }

          var url = config.endPoints.prices+'?format=json&tkr=["'+symbol2+'"]';
          console.log('url',url);
          return $http.get(url).then(
            function(response) {
              console.log('res ass',url,response);
              gcs=0;
              var x={};
              for(var i in response.data) {
                console.log('_____',i,response.data[i]);
                x[i]=self.treatChart(response.data[i]);
              }

              return(x);
            },
            function() { gcs=2; }
          );
        } else {
          console.error('Unsupported source');
        }
      },

      treatChart: function(response) {
        console.log('treat chart',response);
        console.log(response);
        if(response.Elements.length===0) {
          //window.alert('No data');
          return;
        }

        var dates = response.Dates;
        dates = dates.map(function(x) {
          return x.replace('T00:00:00',''); 
        });
        var prices = response.Elements[0].DataSeries.close.values;
        var o = [];
        for(var i=0;i<dates.length;i++) {
          o.push({'date':dates[i],'close':prices[i]});
        }
        var pendingStock = {};
        pendingStock.history = o;
        pendingStock.history2 = angular.fromJson(angular.toJson(prices));
        pendingStock.historyMeta = {
          mindate: dates[0],
          maxdate: dates[dates.length-1]
        };
        pendingStock.historyJqplot = [];
        for(i=0;i<dates.length;i++) {
          pendingStock.historyJqplot.push([dates[i],prices[i]]);
        }

        var pnls = [];
        pnls.push(0);
        for(i=1;i<prices.length;i++) {
          pnls.push(prices[i]/prices[i-1]-1);
        }
        pendingStock.pnls=pnls;

        pendingStock.pnls2=pnls.map(function(x) { return 100*x; });

        var pnlsSort = angular.fromJson(angular.toJson(pnls));
        pnlsSort.sort(function(a,b) {
          return a-b;
        });
        pendingStock.pnlsSort=pnlsSort;

        pendingStock.pnlsEdf=varCalc.edf(pnls,1/100);
        pendingStock.selected=true;
        return pendingStock;
      },

      getGcs: function() { return gcs; },

      update: function(newA) {
        if(!this.exists(newA.src,newA.lookup.Symbol)) {
          this.add(newA);
        } else {
          aaa[newA.src][newA.lookup.Symbol]=newA;
        }
        this.saveToLs();
      }

    };
  });
