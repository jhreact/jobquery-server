'use strict';

var express      = require('express');

var app          = express();

/* Router */
var NoteRouter        = express.Router();
var MessageRouter     = express.Router();
var LoginRouter       = express.Router();
var OpportunityRouter = express.Router();
var TagRouter         = express.Router();

var routers      = {};

routers.NoteRouter        = NoteRouter;
routers.MessageRouter     = MessageRouter;
routers.LoginRouter       = LoginRouter;
routers.OpportunityRouter = OpportunityRouter;
routers.TagRouter         = TagRouter;

require('./config.js')(app, express, routers);

require('../login/login_routes.js')(LoginRouter);
require('../note/note_routes.js')(NoteRouter);
require('../message/message_routes.js')(MessageRouter);

module.exports = exports = app;
