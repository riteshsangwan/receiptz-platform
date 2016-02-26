'use strict';

/**
 * API Application script
 */

/* Globals */
var express = require('express'),
  config = require('config'),
  logger = require('./logger').getLogger(),
  path = require('path'),
  ErrorHandler = require('./middlewares/ErrorHandler'),
  Responser = require('./middlewares/Responser'),
  responseTransformer = require('./middlewares/ResponseTransformer'),
  app = express();

var errorHandler = new ErrorHandler();
var responser = new Responser();

var router = require('./router'),
  port = process.env.PORT || config.WEB_SERVER_PORT || 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var bodyParser = require('body-parser');
// only use bodyParser for json and urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// init application routes
app.use(router());

app.use(responseTransformer());
app.use(responser.middleware());
app.use(errorHandler.middleware());

/**
 * Configuring root path
 */
app.get('/', function(req, res) {
  res.render('index', {
    title : 'ReceiptZ'
  });
});
// start the application
app.listen(port, function() {
  logger.info('Application started successfully', {name: config.NAME, port: port});
});