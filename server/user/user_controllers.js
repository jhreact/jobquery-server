"use strict";

var User = require('./user_model.js');

module.exports = exports = {

  getById: function (req, res, next) {
    User.findById(req.body.id, function (err, user) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.json(200, user);
    });
  },

  putById: function (req, res, next) {
    User.findById(req.body.id, function (err, user) {
      if (err) {
        res.send(500, err);
        return;
      }
      for (var field in User.schema.paths) {
        if ( (field !== '_id') && (field !== '__v') ) {
          if (req.body[field] !== undefined) {
            user[field] = req.body[field];
          }
        }
      }
      user.save(function (err, item) {
        if (err) {
          res.send(500, err);
          return;
        }
        res.json(200, item.id);
      });
    });
  },

  get: function (req, res, next) {
    User.find(function (err, users) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.json(200, users);
    });
  },

  post: function (req, res, next) {
    User.create(req.body.user, function (err, user) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.send(201, user.id);
    });
  }

};
