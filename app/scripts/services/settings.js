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

    // object
    var o = {
      init: function() {
        this.end = {type:'Today',date:today()};
        this.length = {n:3,u:'year'};

        var ls = localStorage.getItem('settings');
        if(!!ls) {
          ls = angular.fromJson(ls);
          this.setEnd(ls.end.type,ls.end.date);
          this.setLength(ls.length.n,ls.length.u);
        }
      },
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
      dashless: function() {
        var st2 = moment(this.start(), 'YYYY-MM-DD').format('YYYYMMDD');
        var en2 = moment(this.end.date,'YYYY-MM-DD').format('YYYYMMDD');
        return {start:st2,end:en2};
      }
    };
    o.init();
    return o;
  });
