'use strict';

/**
 * Router logic, this class will implement all the API routes login
 * i.e, mapping the routes to controller and add auth middleware if any route is secure.
 *
 * @author      ritesh
 * @version     1.0.0
 */

var express = require('express');
var Auth = require('./middlewares/Auth');
var proxy = require('./controllers/ProxyController');

var auth = new Auth();

module.exports = function() {
  var options = {
    caseSensitive: true
  };

  // Instantiate an isolated express Router instance
  var router = express.Router(options);
  // users
  // only retailer login
  router.post('/users/login', proxy.login);
  router.post('/logout', proxy.logout);
  router.get('/me', auth.middleware, proxy.me);
  router.get('/check', auth.middleware, proxy.check);

  // receipts
  router.post('/receipts', auth.middleware, proxy.createReceipt);

  // organizations
  // only retailer sign up
  router.post('/organizations', proxy.createOrganization);

  // show list of items to make a sale transaction
  router.get('/organizations/items', auth.middleware, proxy.getItems);
  router.get('/organizations/dashboard', auth.middleware, proxy.getDashboard);

  return router;
};