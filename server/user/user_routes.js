"use strict";

var controller = require('./user_controllers.js');

module.exports = exports = function (router) {

  router.route('/:id')
    .get(controller.getById)
    .put(controller.putById);

  router.route('/')
    .get(controller.get)
    .post(controller.post);

};
