"use strict";

var controller = require('./match_controllers.js');

module.exports = exports = function (router) {

  router.route('/users/:userId/opportunities/:oppId')
    .put(controller.putByIds)
    .post(controller.postByIds);

  router.route('/users/:id')
    .get(controller.getByUserId);

  router.route('/opportunities/:id')
    .get(controller.getByOppId);

  router.route('/')
    .get(controller.get);

};
