'use strict';

/**
 * UserController
 * This controller acts as a proxy between the API and the user
 *
 * @author      ritesh
 * @version     1.0.0
 */

var request = require('request');

var config = require('config');
var caller = request.defaults({ baseUrl: config.API_BASE_URL });
var logger = require('../logger').getLogger();
var errors = require('common-errors');
var httpStatus = require('http-status');
var _ = require('lodash');
var dashboard = require('./dashboard.json');

var _callProxy = function(options, callback) {
  caller(options, function(error, response, body) {
    if(error) {
      logger.error('Unexpected error ', error);
      return callback(error);
    }
    // all the OK status code are in 2xx range
    if(!error && response.statusCode < 300) {
      callback(null, body);
    } else if(response.statusCode === 400) {
      logger.warn('Validation error ', body);
      // some validation error
      callback(new errors.ValidationError(body.message, httpStatus.BAD_REQUEST));
    } else {
      logger.error('API error ', body);
      // some error occurred in API
      callback(body);
    }
  });
};

exports.check = function(req, res, next) {
  req.data = {
    statusCode: 200
  };
  next();
};

/**
 * Login a user into the application
 *
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.login = function(req, res, next) {
  var credentials = _.pick(req.body, 'email', 'password');

  var options = {
    url: '/users/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    json: true,
    body: credentials
  };
  _callProxy(options, function(err, response) {
    if(err) {
      return next(err);
    } else {
      req.session.user = response;
      req.data = {
        statusCode: httpStatus.OK,
        content: response
      };
      next();
    }
  });
};

/**
 * Get currently logged in user profile
 *
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.me = function(req, res, next) {
  var options = {
    url: '/me',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + req.session.user.token
    }
  };
  _callProxy(options, function(err, response) {
    if(err) {
      return next(err);
    } else {
      req.data = {
        statusCode: httpStatus.CREATED,
        content: response
      };
      next();
    }
  });
};

/**
 * Do a sale transaction
 *
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.createReceipt = function(req, res, next) {
  var entity = _.pick(req.body, 'mobileNumber', 'type', 'amount', 'items');

  var options = {
    url: '/receipts',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.session.user.token
    },
    json: true,
    body: entity
  };
  _callProxy(options, function(err, response) {
    if(err) {
      return next(err);
    } else {
      req.data = {
        statusCode: httpStatus.CREATED,
        content: response
      };
      next();
    }
  });
};

/**
 * Create a organization
 *
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.createOrganization = function(req, res, next) {
  var entity = _.pick(req.body, 'firstName', 'lastName', 'country', 'mobileNumber', 'name', 'streetAddress', 'city', 'state', 'zipCode', 'tax', 'email', 'password');

  var options = {
    url: '/organizations',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    json: true,
    body: entity
  };
  _callProxy(options, function(err, response) {
    if(err) {
      return next(err);
    } else {
      req.data = {
        statusCode: httpStatus.CREATED,
        content: response
      };
      next();
    }
  });
};

/**
 * Get all the items for the organization
 *
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.getItems = function(req, res, next) {
  var options = {
    url: '/organizations/items',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + req.session.user.token
    }
  };
  _callProxy(options, function(err, response) {
    if(err) {
      return next(err);
    } else {
      req.data = {
        statusCode: httpStatus.OK,
        content: response
      };
      next();
    }
  });
};

/**
 * Logout a user from the application
 *
 * @param  {Object}     req         express request instance
 * @param  {Object}     res         express response instance
 * @param  {Function}   next        next function
 */
exports.logout = function(req, res, next) {
  req.session.destroy();
  req.data = {
    statusCode: httpStatus.OK
  };
  next();
};


exports.getDashboard = function(req, res, next) {
  req.data = {
    statusCode: httpStatus.OK,
    content: dashboard
  };
  next();
};