'use strict';

/**
 * @ngdoc directive
 * @name theVarApp.directive:jqSparkline
 * @description https://gist.github.com/pjsvis/6210002
 * # jqSparkline
 */
angular.module('theVarApp')
  .directive('jqSparkline', function ($timeout) {
/*    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the jqSparkline directive');
      }
    };*/
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModel) {
 
                 var opts={};
                 //TODO: Use $eval to get the object
                opts.type = attrs.type || 'line';

                var render = function () {
                    var model;
                    if(attrs.opts) {
                      angular.extend(opts, angular.fromJson(attrs.opts));
                    }
                    //console.log(opts);
                    // Trim trailing comma if we are a string
                    if(angular.isString(ngModel.$viewValue)) {
                      model = ngModel.$viewValue.replace(/(^,)|(,$)/g, '');
                    } else {
                      model = ngModel.$viewValue;
                    }
                    var data;
                    // Make sure we have an array of numbers
                    if(angular.isArray(model)) {
                      data = model;
                    } else {
                      data = model.split(',');
                    }
                    $(elem).sparkline(data, opts);
                };

                scope.$watch(attrs.ngModel, function () {
                  $timeout(function() {
                    render();
                  },100);
                });
                
                scope.$watch(attrs.opts, function(){
                  $timeout(function() {
                    render();
                  },100);
                }
                  );
            }
        };

  });
