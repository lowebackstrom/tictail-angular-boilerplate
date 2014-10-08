/**
 * @license feedeo.se
 * (c) 2013 Feedeo AB. http://feedeo.com
 */
(function (window, angular, undefined) {
    'use strict';


    angular.module('tt-boilerplate', [
        'ui.router',
        'restangular',
        'webStorageModule',
        'ngSanitize',
        'ngAnimate',
        'ngTicTail',

        'templates',

        'tt-boilerplate.home',
        'tt-boilerplate.404'
    ])


    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, RestangularProvider) {

        /* $http defaults */

        $httpProvider.defaults.timeout = 10000;

        /* Handle trailing slashes */

        $urlRouterProvider.rule(function ($injector, $location) {
            var path = $location.path(),
                search = $location.search(),
                params;

            if (path[path.length - 1] === '/') {
                return;
            }

            if (Object.keys(search).length === 0) {
                return path + '/';
            }

            params = [];
            angular.forEach(search, function (v, k) {
                params.push(k + '=' + v);
            });
            return path + '/?' + params.join('&');
        });

        /* Handle 404's */

        $urlRouterProvider.otherwise(function ($injector, $location) {
            $injector.invoke(function ($state) {
                if ($location.path() === '/' || $location.path() === '') {
                    $state.go('home');
                } else {
                    $state.go('404', {}, {
                        location: false
                    });
                }
            });
        });


        /* States */

        $stateProvider
            .state('home', {
                url: '/',
                controller: 'HomeController',
                templateUrl: 'app/home/home.tpl.html'
            })
            .state('404', {
                url: '/404/',
                controller: '404Controller',
                templateUrl: 'app/404/404.tpl.html'
            })
            .state('unauthorized', {
                url: '/unauthorized/',
                controller: 'StatusUnauthorizedController',
                templateUrl: 'app/status/unauthorized.tpl.html'
            });


        RestangularProvider.setBaseUrl('http://localhost:3000');
        RestangularProvider.setDefaultHeaders({
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest"
        });
        RestangularProvider.setDefaultHttpFields({
            withCredentials: true
        });
        RestangularProvider.setRestangularFields({
            id: "_id"
        });
    })


    .controller('AppController', function ($rootScope, $scope, $state, $tt, $q, Restangular) {
        $scope.$state = $state;


        function _login() {
            return Restangular.all('login').post({
                store: $tt.store.id,
                token: $tt.native.accessToken
            }).then(function (response) {
                return response;
            }, function (response) {
                return $q.reject(response);
            });
        }


        function _register() {
            return Restangular.all('register').post({
                store: $tt.store.id,
                token: $tt.native.accessToken
            }).then(function (response) {
                return response;
            }, function (response) {
                return $q.reject(response);
            });
        }


        function _loginOrRegister() {
            var defered = $q.defer();

            _login().then(function (response) {
                defered.resolve(response);
            }, function (response) {
                _register().then(function (response) {
                    defered.resolve(response);
                }, function (response) {
                    defered.reject(response);
                });
            });

            return defered.promise;
        }


        if ($tt.store && $tt.store.id && $tt.native.accessToken) {
            $rootScope.loading = true;

            _loginOrRegister().then(function (response) {
                $scope.user = response;
            }, function (response) {
                // !!! Handle error !!!
            }).
            finally(function () {
                $rootScope.loading = false;
            });
        } else {
            // $state.go('no_store');
        }
    });


})(window, window.angular);
