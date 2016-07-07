'use strict';

/**
 * @ngdoc directive
 * @name theVarApp.directive:varmatrix
 * @description
 * # varmatrix
 */
angular.module('theVarApp')
  .directive('varmatrix', function ($compile) {

    var percentile=[95,99];
    var nday=[1,5,250]; // business days

    function nd2st(nd) {
      if(nd===1) { return '1-day'; }
      if(nd===5) { return '1-week'; }
      if(nd===250) { return '1-year'; }
      return nd+'-day';
    }

    function getMatrix(scope) {
      var table = $('<table/>',{
        class: 'table',
        style: 'width:40%'
      });

      $('<caption/>',{text:'PortfolioVaR'}).appendTo(table);
      var tr = $('<tr/>');
      $('<th/>',{text:''}).appendTo(tr);
      percentile.map(function(p) {
        $('<th/>',{text:p+'%'}).appendTo(tr);
      });
      tr.appendTo(table);
      nday.map(function(nd) {
        tr=$('<tr/>');
        var ndText=nd2st(nd);
        $('<th/>',{text:ndText}).appendTo(tr);
        percentile.map(function(p) {
          var td = $('<td/>');
          $('<divvar/>',{
            varisk: scope.portfolioVaR(p,nd),
            limit: -0.20,
            usd: scope.portfolio.value
          }).appendTo(td);
          td.appendTo(tr);
        });
        tr.appendTo(table);
      });
      return table;
    }

    function getRowHeader() {
      var tr = $('<tr/>');
      percentile.map(function(p) {
        nday.map(function(nd) {
          $('<th/>',{text:'VaR '+p+'%, '+nd2st(nd)}).appendTo(tr);
        });
      });
      return tr;
    }

    return {
      restrict: 'E',
      replace: true,
      link: function postLink(scope, element, attrs) {
        switch(attrs.type) {
          case 'matrix':
            var table = getMatrix(scope);
            table.appendTo(element);
            $compile(element.contents())(scope);
            break;
          case 'rowHeader':
            $(getRowHeader()[0].innerHTML).appendTo(element);
            break;
          default:
            element.text('This is the varmatrix directive');
            break;
        }
      }
    };
  });
