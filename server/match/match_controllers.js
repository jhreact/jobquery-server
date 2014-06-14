"use strict";

var Match = require('./match_model.js');

module.exports = exports = {

  getByUserId: function (req, res, next) {
    // TODO: update
    Match.findById(req.body.id, function (err, match) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.json(200, match);
    });
  },

  putByUserId: function (req, res, next) {
    // TODO: update
    Match.findById(req.body.id, function (err, match) {
      if (err) {
        res.send(500, err);
        return;
      }
      for (var field in Match.schema.paths) {
        if ( (field !== '_id') && (field !== '__v') ) {
          if (req.body[field] !== undefined) {
            match[field] = req.body[field];
          }
        }
      }
      match.save(function (err, item) {
        if (err) {
          res.send(500, err);
          return;
        }
        res.json(200, item.id);
      });
    });
  },

  getByOppId: function (req, res, next) {
    // TODO
    res.send(200);
  },

  postByOppId: function (req, res, next) {
    // TODO
    res.send(200);
  },

  get: function (req, res, next) {
    Match.find(function (err, matches) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.json(200, matches);
    });
  }

};
