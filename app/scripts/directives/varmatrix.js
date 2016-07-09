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

    function getDivVar(varisk,limit,usd,flip) {
      return $('<divvar/>',{
        varisk: varisk,
        limit: limit,
        usd: usd,
        flip: flip
      });
    }

    function getMatrix(scope) {
      var table = $('<table/>',{
        class: 'table varmatrix',
        style: 'width:40%'
      });

      $('<caption/>',{text:'Portfolio VaR (with '+scope.unallocated()+' % unallocated)'}).appendTo(table);
      var tr = $('<tr/>');
      $('<th/>',{text:''}).appendTo(tr);
      nday.map(function(nd) {
        var ndText=nd2st(nd);
        $('<th/>',{nowrap:'',text:ndText}).appendTo(tr);
      });
      tr.appendTo(table);
      percentile.map(function(p) {
        tr=$('<tr/>');
        $('<th/>',{nowrap:'',text:'VaR '+p+' %'}).appendTo(tr);
        nday.map(function(nd) {
          var td = $('<td/>',{nowrap:''});
          getDivVar(
            scope.portfolioVaR(p,nd)*(100-scope.unallocated())/100,
            -0.20,
            scope.portfolio.value,
            false
          ).appendTo(td);
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
          $('<th/>',{
            text:'VaR '+p+'%, '+nd2st(nd),
            class: 'varmatrix'
          }).appendTo(tr);
        });
      });
      return tr;
    }

    function getRowBodyPortfolio(scope) {
      var tr = $('<tr/>');
      percentile.map(function(p) {
        nday.map(function(nd) {
          var td = $('<td/>',{nowrap: '', class:'varmatrix'});
          var perc = 100*scope.portfolioVaR(p,scope.p,nd);
          perc = perc.toFixed(2);
          $('<div/>',{text: perc+' %'}).appendTo(td);
          var usd = scope.p.value*scope.portfolioVaR(p,scope.p,nd);
          usd=usd.toFixed(2);
          $('<div/>',{text: usd+' USD'}).appendTo(td);
          td.appendTo(tr);
        });
      });
      return tr;
    }

//    function getRow(scope) {
//      var table = $('<table/>');
//      var thead = $('<thead/>');
//      var tbody = $('<tbody/>');
//      getRowHeader().appendTo(thead);
//      getRowBodyPortfolio(scope).appendTo(tbody);
//      thead.appendTo(table);
//      tbody.appendTo(table);
//      return table;
//    }

    function getRowBodyAsset(scope) {
      var tr = $('<tr/>');
      percentile.map(function(p) {
        nday.map(function(nd) {
          var varVal = scope.calculateVaR(scope.a,p,nd);
          var td = $('<td/>',{nowrap:'',class:'varmatrix'});
          var perc = 100*varVal;
          perc = perc.toFixed(2);
          getDivVar(
            varVal,
            scope.a.pnls[scope.a.pnls.length-1],
            scope.a.pct/100*scope.portfolio.value,
            true
          ).appendTo(td);
          td.appendTo(tr);
        });
      });
      return tr;
    }

    function getColumn(scope) {
      var table = $('<table/>',{class:'table varmatrix'});

      // header
      var tr=$('<tr/>');
      $('<td/>').appendTo(tr);
      nday.map(function(nd) {
        var ndText=nd2st(nd);
        $('<td/>',{text:ndText}).appendTo(tr);
      });
      tr.appendTo(table);

      // body
      percentile.map(function(p) {
        var tr=$('<tr/>');
        $('<td/>',{text:'VaR '+p+'%'}).appendTo(tr);
        nday.map(function(nd) {
          var varVal = 100*scope.calculateVaR(scope.pendingStock,p,nd);
          varVal=varVal.toFixed(2);
          $('<td/>',{text:varVal+' %'}).appendTo(tr);
        });
        tr.appendTo(table);
      });
      return table;
    }

    return {
      restrict: 'EA',
      transclude: false,
      link: function postLink(scope, element, attrs) {
        scope.$watch('[unallocated(),a.pct,pendingStock.historyMeta.maxdate,pendingStock.historyMeta.mindate,portfolio.value,p.value]', function() {
          element.find('.varmatrix').remove();
          var grb;
          switch(attrs.type) {
            case 'matrix':
              getMatrix(scope).appendTo(element);
              // compile to re-render the 'divvar' entry
              $compile(element.contents())(scope);
              break;
            case 'rowHeader':
              grb = getRowHeader();
              grb.find('th').appendTo(element);
              break;
            case 'rowBodyPortfolio':
              grb = getRowBodyPortfolio(scope);
              grb.find('td').appendTo(element);
              break;
// row is useless because rowBodyPortfolio requires the portfolio from scope.p from ng-repeat="p in list()"
//          case 'row':
//            console.log('rb',element.html());
//            var gr = getRow(scope);
//            gr.find('thead>tr>th').appendTo(element.find('thead>tr'));
//            gr.find('tbody>tr>td').appendTo(element.find('tbody>tr'));
//            break;
            case 'rowBodyAsset':
              grb = getRowBodyAsset(scope);
              grb.find('td').appendTo(element);
              // compile to re-render the 'divvar' entry
              $compile(element.contents())(scope);
              break;
            case 'column':
              grb = getColumn(scope);
              grb.appendTo(element); //.find('tbody:last'));
              break;
            default:
              //element.text('This is the varmatrix directive');
              break;
          }
        });
      }
    };
  });
