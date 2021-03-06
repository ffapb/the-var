'use strict';

/**
 * @ngdoc service
 * @name theVarApp.Assets
 * @description
 * # Assets
 * Service in the theVarApp.
 */
angular.module('theVarApp')
  .service('Assets', function (markitOnDemand,varCalc,$http,moment,Settings,$log) {
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
      listFlat: function() {
        var al = this.list();
        // flatten
        var o = [];
        Object.keys(al).map(function(src) {
          Object.keys(al[src]).map(function(symbol) {
            o.push(al[src][symbol]);
          });
        });
        return o;
      },
      saveToLs: function() {
        localStorage.setItem('aaa',angular.toJson(aaa));
      },
      na: function() {
        return this.listFlat().length;
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
        $log.debug('Getting prices',src,symbol); 
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
            symbol2=symbol.join('","');
          }

          var url = config.endPoints.prices+'?format=json&tkr=["'+symbol2+'"]'+'&start='+Settings.dashless().start+'&end='+Settings.dashless().end;
          $log.debug('assets get chart',url);
          return $http.get(url).then(
            function(response) {
              $log.debug('res ass',url,response);
              gcs=0;
              var x={};
              for(var i in response.data) {
                $log.debug('_____',i,response.data[i]);
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
        $log.debug('treat chart',response);
        $log.debug(response);
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
        pendingStock.historyDateless = prices;
        pendingStock.historyDownsampled = this.downsample(prices,100); // end up with 100 points

        var prevEom = this.findPrevEom(dates,'month');
        var prevEoy = this.findPrevEom(dates,'year');
        pendingStock.historyMeta = {
          mindate: dates[0],
          maxdate: dates[dates.length-1],
          lastprice: prices[dates.length-1],
          firstprice: prices[0],
          prevEomDate: prevEom!==-1?dates[prevEom]:'N/A',
          prevEomClose: prevEom!==-1?prices[prevEom]:'N/A',
          prevEoyDate: prevEoy!==-1?dates[prevEoy]:'N/A',
          prevEoyClose: prevEoy!==-1?prices[prevEoy]:'N/A',
          tm1date: dates.length>1?dates[dates.length-2]:'N/A',
          tm1price: dates.length>1?prices[dates.length-2]:'N/A'
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

        pendingStock.pnlsDownsampled=this.downsample(
          pnls.map(function(x) { return 100*x; }),
          100
        );

        pendingStock.historyMeta.pnl = {
          last: pendingStock.pnls[pendingStock.pnls.length-1]*100,
          eom: (prices[prices.length-1]/prices[prevEom]-1)*100,
          eoy: (prices[prices.length-1]/prices[prevEoy]-1)*100,
          first: (prices[prices.length-1]/prices[0]-1)*100
        };

        pendingStock.pnlsJqplot=[];
        for(i=1;i<prices.length;i++) {
          pendingStock.pnlsJqplot.push([
            dates[i],
            100*(prices[i]/prices[i-1]-1)
          ]);
        }

        var pnlsSort = angular.fromJson(angular.toJson(pnls));
        pnlsSort.sort(function(a,b) {
          return a-b;
        });
        pendingStock.pnlsSort=pnlsSort;

        var edf = varCalc.edf(pnls,1/100);
        pendingStock.pnlsEdf=edf.percentages;

        pendingStock.pnlsEdfJqplot = [];
        for(i=0;i<edf.percentages.length;i++) {
          //pendingStock.pnlsEdfJqplot.push(Math.abs(edf.percentages[i]));
          pendingStock.pnlsEdfJqplot.push([edf.edges[i]*100,Math.abs(edf.percentages[i])]);
        }

        return pendingStock;
      },

      // downsample
      // x: array of points
      // l: result length
      downsample: function(x,l) {
        var y = angular.fromJson(angular.toJson(x));
        var o = [];
        var skip = Math.floor(y.length / l);
        for(var i=0;i<y.length;i++) {
          if(i % skip === 0) {
            o.push(y[i]);
          }
        }
        return o;
      },

      // calculate prevEom date and price
      findPrevEom: function(dates,target) {
        if(target!=='month' && target!=='year') {
          console.error('Unsupported target');
          return -1;
        }

        var maxDate = dates[dates.length-1];
        var prevEom = moment(maxDate,'YYYY-MM-DD')
          .startOf(target)
          .subtract(1,'days')
          .format('YYYY-MM-DD');
        var io = dates.indexOf(prevEom);
        if(io!==-1) { return io; }
        var before = dates.filter(function(x) { return x<prevEom; });
        if(before.length>0) {
          before=before[before.length-1];
          io = dates.indexOf(before);
          if(io!==-1) { return io; }
        }
        return -1;
      },

      getGcs: function() { return gcs; },

      update: function(newA) {
        if(!this.exists(newA.src,newA.lookup.Symbol)) {
          this.add(newA);
        } else {
          aaa[newA.src][newA.lookup.Symbol]=newA;
        }
        this.saveToLs();
      },

      getChartAndUpdate: function(newA,config) {
        var self = this;
        return this.getChart(newA.src,newA.lookup.Symbol,config)
          .then(function(ps) {
            if(newA.src==='mod') { ps={'test':ps}; }
            $log.debug('ps',ps);
            for(var s in ps) {
              // http://stackoverflow.com/a/171256/4126114
              for(var attrname in ps[s]) {
                newA[attrname] = ps[s][attrname];
              }
              self.update(newA);
            }
          });

      },

      clear: function() {
        aaa={};
      }

    };
  });
