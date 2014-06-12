"use strict";

var controller = require('./message_controllers.js');

module.exports = exports = function (router) {
  router.route('/')
    .post(controller.post);

  router.route('/:id')
    .get(controller.getById);
};
