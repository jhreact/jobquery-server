/* jslint node: true */

'use strict';

var express      = require('express');
var app          = express();

/* Router */
var LoginRouter       = express.Router();
var OpportunityRouter = express.Router();
var TagRouter         = express.Router();
var UserRouter        = express.Router();
var MatchRouter       = express.Router();
var CompanyRouter     = express.Router();
var CategoryRouter    = express.Router();
var InviteRouter      = express.Router();

var routers      = {};

routers.LoginRouter       = LoginRouter;
routers.OpportunityRouter = OpportunityRouter;
routers.TagRouter         = TagRouter;
routers.UserRouter        = UserRouter;
routers.MatchRouter       = MatchRouter;
routers.CompanyRouter     = CompanyRouter;
routers.CategoryRouter    = CategoryRouter;
routers.InviteRouter      = InviteRouter;

require('./config.js')(app, express, routers);

require('../login/login_routes.js')(LoginRouter);
require('../opportunity/opportunity_routes.js')(OpportunityRouter);
require('../tag/tag_routes.js')(TagRouter);
require('../user/user_routes.js')(UserRouter);
require('../match/match_routes.js')(MatchRouter);
require('../company/company_routes.js')(CompanyRouter);
require('../category/category_routes.js')(CategoryRouter);
require('../invite/invite_routes.js')(InviteRouter);

module.exports = exports = app;
