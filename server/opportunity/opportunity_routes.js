"use strict";

var controller = require('./opportunity_controllers.js');

module.exports = exports = function (router) {

  router.route('/:id')
    .get(controller.getById)
    .put(controller.getById);

  router.route('/')
    .get(controller.get)
    .post(controller.post);

};
