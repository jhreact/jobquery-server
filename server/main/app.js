/* jslint node: true */

'use strict';

var express      = require('express');
var app          = express();

// global.url = 'http://jobquerystagingclient.azurewebsites.net';
global.url = process.env.GLOBAL_URL || 'https://localhost:8000';
global.smtpUsername = process.env.smtpUsername || 'jobquerybeta@gmail.com';
global.smtpPassword = process.env.smtpPassword || 'l0jxZWuRXZ9j';

global.fromEmail = 'jobquery-do-not-respond@gmail.com';

/* Router */
var LoginRouter       = express.Router();
var PublicRouter      = express.Router();
var OpportunityRouter = express.Router();
var TagRouter         = express.Router();
var UserRouter        = express.Router();
var MatchRouter       = express.Router();
var CompanyRouter     = express.Router();
var CategoryRouter    = express.Router();
var InviteRouter      = express.Router();
var AuthRouter        = express.Router();

var routers      = {};

routers.LoginRouter       = LoginRouter;
routers.PublicRouter      = PublicRouter;
routers.OpportunityRouter = OpportunityRouter;
routers.TagRouter         = TagRouter;
routers.UserRouter        = UserRouter;
routers.MatchRouter       = MatchRouter;
routers.CompanyRouter     = CompanyRouter;
routers.CategoryRouter    = CategoryRouter;
routers.InviteRouter      = InviteRouter;
routers.AuthRouter        = AuthRouter;

require('./config.js')(app, express, routers);

require('../login/login_routes.js')(LoginRouter);
require('../public/public_routes.js')(PublicRouter);
require('../opportunity/opportunity_routes.js')(OpportunityRouter);
require('../tag/tag_routes.js')(TagRouter);
require('../user/user_routes.js')(UserRouter);
require('../match/match_routes.js')(MatchRouter);
require('../company/company_routes.js')(CompanyRouter);
require('../category/category_routes.js')(CategoryRouter);
require('../invite/invite_routes.js')(InviteRouter);
require('../auth/auth_routes.js')(AuthRouter);

module.exports = exports = app;
