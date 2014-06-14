"use strict";

var controller = require('./match_controllers.js');

module.exports = exports = function (router) {

  router.route('/users/:id')
    .get(controller.getByUserId)
    .put(controller.putByUserId);

  router.route('/opportunities/:id')
    .get(controller.getByOppId)
    .put(controller.putByOppId);

  router.route('/')
    .get(controller.get)
    .post(controller.post);

};
