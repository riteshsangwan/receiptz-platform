'use strict';

/**
 * This is the main file. This will bootstrapped the HQ angular app and will do the required configurations
 */
var app = angular.module('receiptzApp', ['ui.bootstrap', 'ui.router', 'receiptzApp.controllers', 'receiptzApp.services']);

/**
 * App configurations goes here
 */
app.config(['$stateProvider', '$urlRouterProvider','$locationProvider', '$compileProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript):/);
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('landing', {
      url: '/',
      templateUrl: 'partials/landing.html',
      controller: 'LandingController'
    })
    .state('home', {
      url: '/home',
      templateUrl: 'partials/home.html',
      controller: 'HomeController'
    })
    // this registration is only for business owners
    .state('register', {
      url: '/register',
      templateUrl: 'partials/register.html',
      controller: 'RegisterController'
    });
}]);

app.run(['$rootScope', '$state', 'UserService', function($rootScope, $state, UserService) {

  // check if the user is authenticated
  UserService.me().then(function() {
    // if the user is logged in go to home state
    $state.go('home');
  });

  $rootScope.logout = function() {
    UserService.logout().then(function() {
      $state.go('landing');
    });
  };
}]);