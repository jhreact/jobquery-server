/* jslint node: true */

"use strict";

var userController = require('../user/user_controllers.js');
var companyController = require('../company/company_controllers.js');
var matchController = require('../match/match_controllers.js');

module.exports = exports = function (router) {

  router.route('/account/:id')
    .get(userController.getById)
    .put(userController.putById);

  router.route('/companies/:id')
    .get(companyController.getById);

  router.route('/companies')
    .get(companyController.get);

  router.route('/opportunities/:opportunity')
    .put(function (req, res) {
      req.params.user = req.params.id;
      matchController.putByIds(req, res);
    });

  router.route('/opportunities')
    .get(matchController.getByUserId);

};
