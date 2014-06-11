"use strict";

var bodyParser    = require('body-parser'),
    middle        = require('./middleware'),
    mongoose      = require('mongoose'),
    morgan        = require('morgan'),
    expressJwt    = require('express-jwt');


mongoose.connect(process.env.DB_URL || 'mongodb://localhost/myApp');
/*
 * Include all your global env variables here.
*/
module.exports = exports = function (app, express, routers) {
  app.set('port', process.env.PORT || 9000);
  app.set('base url', process.env.URL || 'http://localhost');
  app.use(morgan('dev'));
  app.use(bodyParser());
  app.use(middle.cors);
  app.use('/note' , routers.NoteRouter);
  app.use('/login', routers.LoginRouter);
  app.use('/api', expressJwt({secret: process.env.SECRET || 'secret'}))
  app.use('/api/messages', routers.MessageRouter);
  app.use('/api/opportunities', routers.OpportunityRouter);
  app.use('/api/tags', routers.TagRouter);
  app.use(middle.logError);
  app.use(middle.handleError);
};
