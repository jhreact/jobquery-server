"use strict";

var controller = require('./invite_controllers.js');

module.exports = exports = function (router) {

  router.route('/')
    .post(controller.sendInvites)

};
