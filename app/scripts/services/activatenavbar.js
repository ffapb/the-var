'use strict';

/**
 * @ngdoc service
 * @name theVarApp.ActivateNavBar
 * @description
 * # ActivateNavBar
 * Service in the theVarApp.
 */
angular.module('theVarApp')
  .service('ActivateNavBar', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      portfolios: function() {
        $('.nav.navbar-nav > li').removeClass('active');
        $('.nav.navbar-nav > li:nth-child(2)').addClass('active');
      }
    };
  });
