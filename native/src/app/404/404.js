/**
 * @license feedeo.se
 * (c) 2013 Feedeo AB. http://feedeo.com
 */
(function (window, angular, undefined) {
    'use strict';


    angular.module('tt-boilerplate.404', [])


    .controller('404Controller', function ($scope, $location) {
        console.log($location.path());
    });


})(window, window.angular);
