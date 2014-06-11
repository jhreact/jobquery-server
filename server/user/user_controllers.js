"use strict";

var User = require('./user_model.js');

module.exports = exports = {

  get: function (req, res, next) {
    User.find(function (err, users) {
      if (err) {
        res.send(500, err);
      }
      res.json(200, users);
    });
  },

  post: function (req, res, next) {
    User.create(req.body.user, function (err, user) {
      if (err) {
        res.send(500, err);
      }
      res.send(201, user.id);
    });
  }

};
