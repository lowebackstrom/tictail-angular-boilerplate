/**
 * @license feedeo.se
 * (c) 2013 Feedeo AB. http://feedeo.com
 */
(function (window, angular, undefined) {
    'use strict';


    angular.module('ngTicTail', ['restangular'])


    .provider('$tt', function () {
        var options = {
            ttApiVersion: 'v1'
        };

        this.option = function (key, value) {
            if (!value) {
                return options[key];
            }

            return options[key] = value;
        };

        this.$get = function ($window, $q, Restangular) {
            var TT, service;


            TT = $window.TT;


            service = {
                api: null,
                store: null,
                native: TT.native
            };


            /**
             *
             */
            function _setupApi() {
                if (!$window.__store) {
                    throw new Error('Store could not be loaded!');
                }
                if (!TT.native.accessToken) {
                    throw new Error('No accessToken found!');
                }

                service.native.accessToken = TT.native.accessToken;
                service.store = $window.__store;
                service.api = Restangular.withConfig(function (config) {
                    config.setBaseUrl('https://api.tictail.com/' + options.ttApiVersion + '/stores/' + service.store.id);
                    config.setDefaultHeaders({
                        Authorization: 'Bearer ' + service.native.accessToken
                    });
                    config.setDefaultHttpFields({
                        cache: false,
                        timeout: 10000
                    });
                });

                delete $window.__store;
            };


            _setupApi();


            return service;
        }
    });


})(window, window.angular);
