/* jslint node: true */

"use strict";

var userController = require('./user/user_controllers.js');
var companyController = require('../company/company_controllers.js');
var matchController = require('../match/match_controllers.js');
var tagController = require('../tag/tag_controllers.js');

module.exports = exports = function (router) {

  router.route('/account')
    .get(userController.getById)
    .put(userController.putById);

  router.route('/companies/:id')
    .get(companyController.getById);

  router.route('/tags')
    .get(tagController.get);

  router.route('/companies')
    .get(companyController.get);

  router.route('/opportunities/:id')
    .put(matchController.putByIds)
    .get(matchController.getByUserId);

};
