'use strict';

/**
 * Main file for the module
 * @author      ritesh
 * @version     1.0.0
 */

var errors = require('common-errors');

function Auth() {
}

/**
 * Middleware function
 *
 * @param   {Object}    req             config object
 */
Auth.prototype.middleware = function(req, res, next) {
  // simple session based authentication
  if(req.session && req.session.user) {
    next();
  } else {
    next(new errors.AuthenticationRequiredError('Authorization token is expired'));
    next();
  }
};

// export the constructor
module.exports = Auth;