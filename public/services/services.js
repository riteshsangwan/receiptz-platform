'use strict';
/**
 * Angularjs services
 */

var appServices = angular.module('receiptzApp.services', []);

appServices.factory('UserService', ['$q', '$http', 'RequestHelper', function($q, $http, RequestHelper) {
  var service = {};

  service.me = function() {
    return RequestHelper.execute({
      url: '/me'
    });
  };

  service.check = function() {
    return RequestHelper.execute({
      url: '/check'
    });
  };

  service.logout = function() {
    return RequestHelper.execute({
      url: '/logout',
      method: 'POST'
    });
  };

  service.registerOrganization = function(organization) {
    return RequestHelper.execute({
      url: '/organizations',
      method: 'POST',
      data: organization
    });
  };

  service.login = function(credentials) {
    return RequestHelper.execute({
      url: '/users/login',
      method: 'POST',
      data: credentials
    });
  };

  return service;
}]);

appServices.factory('OrganizationService', ['$http', '$q', 'RequestHelper', function($http, $q, RequestHelper) {
  var service = {};

  service.getItems = function() {
    return RequestHelper.execute({
      url: '/organizations/items'
    });
  };

  service.getDashboard = function() {
    return RequestHelper.execute({
      url: '/organizations/dashboard'
    });
  };

  return service;
}]);

appServices.factory('ReceiptService', ['RequestHelper', function(RequestHelper) {
  var service = {};

  service.create = function(entity) {
    return RequestHelper.execute({
      url: '/receipts',
      method: 'POST',
      data: entity
    });
  };

  return service;
}]);

appServices.factory('RequestHelper', ['$q', '$http', '$log', function( $q, $http, $log) {
  var service = {};
  var defaultMethod  = 'GET';

  /**
  * Creates a request object for an ajax call ($http)
  * @param {object} options
  * @returns an object containing the request attributes
  */
  service.createRequest = function(options) {
    // Options must exist and it should contain the url attribute
    if(!options) {
      throw new Error(' empty options found for createRequest');
    }

    // check that the options has URL
    if(!options.url) {
      throw new Error(' no url found for createRequest');
    }

    var method =  options.method || defaultMethod;

    var req = {
      method: method,
      url : options.url
    };

    // Add the data if available
    if(options.data) {
      req.data = options.data;
    }
    return req;
  };

  /**
  * executes a http request based in the options passed in
  * uses createRequest method to create the request
  * @param {object} options
  * @returns a promise which will resolve into the http response
  */
  service.execute = function(options) {
    var deferred = $q.defer(),
    req = service.createRequest(options);

    $http(req).then(function(payload) {
      deferred.resolve(payload.data);
    }, function(reason) {
      $log.error('Unexpected error executing ' + JSON.stringify(req) + ' error ' + JSON.stringify(reason));
      deferred.reject(reason);
    });

    return deferred.promise;
  };

  return service;
}]);