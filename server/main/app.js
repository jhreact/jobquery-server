'use strict';

var cookieParser = require('cookie-parser');
var express      = require('express');

var app          = express();

/* Router */
var NoteRouter   = express.Router();
var MessageRouter = express.Router();
var TagRouter = express.Router();
var OpportunityRouter = express.Router();

var routers      = {};

routers.NoteRouter  = NoteRouter;
routers.MessageRouter = MessageRouter;
routers.TagRouter = TagRouter;
routers.OpportunityRouter = OpportunityRouter;

require('./config.js')(app, express, routers);

require('../note/note_routes.js')(NoteRouter);
require('../message/message_routes.js')(MessageRouter);
require('../tag/tag_routes.js')(TagRouter);
require('../opportunity/opportunity_routes.js')(OpportunityRouter);

module.exports = exports = app;
