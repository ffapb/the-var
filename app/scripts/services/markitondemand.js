'use strict';

/**
 * @ngdoc service
 * @name theVarApp.markitOnDemand
 * @description
 * # markitOnDemand
 * Service in the theVarApp.
 */
angular.module('theVarApp')
  .service('markitOnDemand', function ($http,Settings,moment) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      // Based on 
      // https://github.com/markitondemand/DataApis/blob/gh-pages/LookupSample/index.html
      // and http://angular-ui.github.io/bootstrap/ (scroll to typeahead)
      lookup: function(val) {
        // var url = 'http://dev.markitondemand.com/api/v2/Lookup/jsonp';
        var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp';

        return $http.jsonp(url, {
          params: {
            input: val,
            jsoncallback: 'JSON_CALLBACK'
          }
        }).then(function(response){
          return response.data;
        });
      },

      quote: function(val) {
        var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp';

        return $http.jsonp(url, {
          params: {
            symbol: val.symbol.Symbol,
            jsoncallback: 'JSON_CALLBACK'
          }
        }).then(function(response){
          return response.data;
        });
      },

      interactiveChart: function(symbol) {
        var url = 'http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/jsonp';

        var parameters = {
          DataPeriod: 'Day', // Month
          NumberOfDays: 365,
          Normalized: false, // until I understand how they're normalizing, I'm just using the close prices
          Elements: [
            {
              Symbol: symbol,
              Type: 'price',
              Params: ['c'],
            }
          ]
        };
        if(Settings.end!==moment().format('YYYY-MM-DD') || Settings.length.n!==1 || Settings.length.y!=='year') {
          // http://dev.markitondemand.com/MODApis/#interactive
          delete parameters.NumberOfDays;
          parameters.StartDate = Settings.start()+'T00:00:00-00';
          parameters.EndDate = Settings.end+'T00:00:00-00';
        }

        return $http.jsonp(url, {
          params: {
            parameters: parameters,
            jsoncallback: 'JSON_CALLBACK'
          }
        });

      }
    };
  });
