'use strict';

var express      = require('express');
var app          = express();

/* Router */
// var NoteRouter        = express.Router();
var LoginRouter       = express.Router();
// var MessageRouter     = express.Router();
var OpportunityRouter = express.Router();
var TagRouter         = express.Router();
var UserRouter        = express.Router();
var CompanyRouter     = express.Router();
var MatchRouter       = express.Router();

var routers      = {};

// routers.NoteRouter        = NoteRouter;
routers.LoginRouter       = LoginRouter;
// routers.MessageRouter     = MessageRouter;
routers.OpportunityRouter = OpportunityRouter;
routers.TagRouter         = TagRouter;
routers.UserRouter        = UserRouter;
routers.CompanyRouter     = CompanyRouter;
routers.MatchRouter       = MatchRouter;

require('./config.js')(app, express, routers);

// require('../note/note_routes.js')(NoteRouter);
require('../login/login_routes.js')(LoginRouter);
// require('../message/message_routes.js')(MessageRouter);
require('../opportunity/opportunity_routes.js')(OpportunityRouter);
require('../tag/tag_routes.js')(TagRouter);
require('../user/user_routes.js')(UserRouter);
require('../company/company_routes.js')(CompanyRouter);

module.exports = exports = app;
