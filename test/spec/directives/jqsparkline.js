'use strict';

describe('Directive: jqSparkline', function () {

  // load the directive's module
  beforeEach(module('theVarApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    scope.x=[1,2,3];
    element = angular.element('<div jq-sparkline ng-model="x"></div>');
    element = $compile(element)(scope);
    //expect(element.text()).toBe('this is the jqSparkline directive');
  }));
});
