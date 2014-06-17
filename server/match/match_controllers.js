"use strict";

var Match = require('./match_model.js');

module.exports = exports = {

  getByUserId: function (req, res) {
    Match.find({userId: req.params.id}, function (err, matches) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(200, matches);
    });
  },

  getByOppId: function (req, res) {
    Match.find({oppId: req.params.id}, function (err, matches) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(200, matches);
    });
  },

  putByIds: function (req, res) {
    Match.findOne({
      oppId: req.params.oppId,
      userId: req.params.userId
    }, function (err, match) {
      if (err) {
        res.json(500, err);
        return;
      }

      Match.schema.eachPath(function (field) {
        if ( (field !== '_id') && (field !== '__v') ) {
          if (req.body[field] !== undefined) {
            match[field] = req.body[field];
          }
        }
      });

      match.save(function (err, item) {
        if (err) {
          res.json(500, err);
          return;
        }
        res.json(201, item.id);
      });
    });
  },

  post: function (req, res) {
    Match.create(req.body, function (err, match) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(201, match.id);
    });
  },

  get: function (req, res) {
    Match.find(function (err, matches) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(200, matches);
    });
  }

};
