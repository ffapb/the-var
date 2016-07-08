'use strict';

/**
 * @ngdoc directive
 * @name theVarApp.directive:divvar
 * @description
 * # divvar
 */
angular.module('theVarApp')
  .directive('divvar', function () {
    function color(varisk,limit,flip) {
      if(flip) {
        var temp=varisk;
        varisk=limit;
        limit=temp;
      }
      if(varisk>limit) { return 'black'; }
      if(varisk<limit) { return 'red'; }
      return 'orange';
    }
 
    function msg(varisk,limit,flip) {
      if(flip) {
        var temp=varisk;
        varisk=limit;
        limit=temp;
      }
      return 'Red if '+varisk.toFixed(2)+' % < '+limit.toFixed(2)+' %';
    }

    return {
      restrict: 'E',
      transclude: true,
      link: function postLink(scope, element, attrs) {
        attrs.varisk = parseFloat(attrs.varisk);
        attrs.limit = parseFloat(attrs.limit);
        attrs.usd = parseFloat(attrs.usd);
        attrs.flip = attrs.hasOwnProperty('flip') && (attrs.flip==='' || attrs.flip==='true');

        var d1 = $('<div/>',{
          style: 'color:'+color(100*attrs.varisk,100*attrs.limit,attrs.flip),
          title: msg(100*attrs.varisk,100*attrs.limit,attrs.flip)
        });
        $('<div/>').text((100*attrs.varisk).toFixed(2)+' %').appendTo(d1);
        $('<div/>').text((attrs.varisk*attrs.usd).toFixed(2)+' USD').appendTo(d1);
        d1.appendTo(element);
      }
    };
  });
