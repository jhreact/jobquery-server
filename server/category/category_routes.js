"use strict";

var controller = require('./category_controllers.js');

module.exports = exports = function (router) {

router.route('/type/:type')
    .get(controller.getByType);

  router.route('/:id')
    .put(controller.putById);

  router.route('/')
    .get(controller.get)
    .post(controller.post);
};
