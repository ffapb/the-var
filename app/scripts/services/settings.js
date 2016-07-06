'use strict';

/**
 * @ngdoc service
 * @name theVarApp.Settings
 * @description
 * # Settings
 * Service in the theVarApp.
 */
angular.module('theVarApp')
  .service('Settings', function (moment) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      end: moment().format('YYYY-MM-DD'),
      length: {n:3,u:'year'},
      start: function() {
        return moment(this.end,'YYYY-MM-DD')
          .subtract(this.length.n,this.length.u)
          .format('YYYY-MM-DD');
      },
      setEnd: function(d2) { this.end = d2; },
      setLength: function(n,u) { this.length.n=n; this.length.u=u; }
    };
  });
