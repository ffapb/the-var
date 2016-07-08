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

    function today() { return moment().format('YYYY-MM-DD'); }
    function yesterday() { return moment().subtract(1,'day').format('YYYY-MM-DD'); }

    var end = {type:'Today',date:today()};
    var length = {n:3,u:'year'};

    var ls = localStorage.getItem('settings');
    if(!!ls) {
      ls = angular.fromJson(ls);
      end = ls.end;
      length.n = ls.length.n;
      length.u = ls.length.u;
    }

    return {
      end: end,
      length: length,
      start: function() {
        return moment(this.end.date,'YYYY-MM-DD')
          .subtract(this.length.n,this.length.u)
          .format('YYYY-MM-DD');
      },
      setEnd: function(type,date) {
        if(type==='Today') { date=today(); }
        if(type==='Yesterday') { date=yesterday(); }
        this.end = {type:type,date:date};
      },
      setLength: function(n,u) { this.length.n=n; this.length.u=u; },
    };
  });
