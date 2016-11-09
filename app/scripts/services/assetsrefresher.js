'use strict';

/**
 * @ngdoc service
 * @name theVarApp.AssetsRefresher
 * @description
 * # AssetsRefresher
 * Service that wraps the Assets service to refresh all prices
 */
angular.module('theVarApp')
  .service('AssetsRefresher', function (Assets,ffa,$log) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var config, al, srcA=[], srcV, symbolA=[];

    function recurseSymbols() {
      // terminal condition
      //$log.debug('symbol left: '+symbolA.length);
      if(symbolA.length===0) { return recurseKeys(); }

      var symbolV = symbolA.pop();
      al[srcV][symbolV].retrieving=true;
      return Assets.getChartAndUpdate(al[srcV][symbolV],config)
        .then(function() {
          al[srcV][symbolV].retrieving=false;
          Assets.saveToLs();
          return recurseSymbols();
        });
    }

    function recurseKeys() {
      // terminal condition
      //$log.debug('src left: '+srcA.length);
      if(srcA.length===0) { return; }
      srcV = srcA.pop();
      symbolA=Object.keys(al[srcV]);
      //$log.debug('symbol init: '+symbolA.length);
      return recurseSymbols();
    }

    function core() {
      al = Assets.list();
      $log.debug('srca',srcA.length);
      srcA=Object.keys(al);
      //$log.debug('src init: '+srcA.length);
      return recurseKeys();
    }

    // similar to controllers/assetshow.js#getChart
    return {
      isRunning: function() {
        return srcA.length>0 || symbolA.length>0 || Assets.listFlat().filter(function(x) { return !!x.retrieving; }).length>0;
      },
      run: function() {
        config = false;

        // get ffa config in case needed
        var fc = ffa.ffaConfig1();
        if(!!fc) {
          //$log.debug('ffa config',fc);
          return fc.then(function(c2) {
            config = c2;
            return core();
          });
        } else {
          console.error('Failed to get ffa config');
          return core();
        }
      }
    };


  });
