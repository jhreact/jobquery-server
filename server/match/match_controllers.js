"use strict";

var Match = require('./match_model.js');

module.exports = exports = {

  getByUserId: function (req, res) {
    Match.find({userId: req.params.id}, function (err, matches) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.send(200, matches);
    });
  },

  getByOppId: function (req, res) {
    Match.find({oppId: req.params.id}, function (err, matches) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.send(200, matches);
    });
  },

  putByIds: function (req, res) {
    Match.findOne({
      oppId: req.params.oppId,
      userId: req.params.userId
    }, function (err, match) {
      if (err) {
        res.send(500, err);
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
          res.send(500, err);
          return;
        }
        res.send(200, item.id);
      });
    });
  },

  post: function (req, res) {
    Match.create({
      oppId:          req.body.oppId,
      userId:         req.body.userId,
      isProcessed:    req.body.isProcessed,
      userInterest:   req.body.userInterest,
      answers:        req.body.answers
    }, function (err, match) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.send(200, match.id);
    });
  },

  get: function (req, res) {
    Match.find(function (err, matches) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.send(200, matches);
    });
  }

};
