"use strict";

var Tag = require('./tag_model.js');
var Feed = require('../feed/feed_model.js');
var UNABLE_TO_SAVE      = "Server unable to save tag.";
var UNABLE_TO_RETRIEVE  = "Server unable to retrieve tag.";

module.exports = exports = {

  post: function (req, res) {
    // depopulate category
    if (req.body.category && req.body.category._id) {
      req.body.category = req.body.category._id;
    }
    Tag.create(req.body, function (err, tag) {
      if (err) {
        res.json(500, UNABLE_TO_SAVE);
        return;
      }

      var feedAct = req.body.feedAction || "created";
      var feedSum = req.body.feedSummary || "created a tag";
      var feedDispName = req.body.targetDisplayName || tag.name;
      Feed.create({
        user: req.body.uid,
        action: feedAct,
        target: tag.id,
        targetType: "Tag",
        targetDisplayName: feedDispName,
        summary: feedSum
      }, function(err, feedItem) {
        if (err) {
          res.json(500, err);
          return;
        }
        res.json(201, {_id: tag.id});
      });
    });
  },

  get: function (req, res) {
    Tag.find()
    .where('active').equals(true)
    .populate({path: 'category', select: '-createdAt -updatedAt'})
    .select('-createdAt -updatedAt')
    .exec(function(err, tags) {
      if (err) {
        res.json(500, UNABLE_TO_RETRIEVE);
        return;
      }
      res.json(200, tags);
    });
  },

  getById: function (req, res) {
    Tag.findById(req.params.id)
    .populate({path: 'category', select: '-createdAt -updatedAt'})
    .select('-createdAt -updatedAt')
    .exec(function (err, tag) {
      if (err) {
        res.json(500, UNABLE_TO_RETRIEVE);
        return;
      }
      res.json(200, tag);
    });
  },

  putById: function (req, res) {
    Tag.findById(req.params.id, function (err, tag) {
      if (err) {
        res.json(500, UNABLE_TO_RETRIEVE);
        return;
      }

      Tag.schema.eachPath(function (field) {
        if ( (field !== '_id') && (field !== '__v') ) {
          if (req.body[field] !== undefined) {
            // depopulate category
            if (field === 'category') {
              if (req.body.category && req.body.category._id) {
                req.body.category = req.body.category._id;
              }
            }
            tag[field] = req.body[field];
          }
        }
      });

      tag.save(function (err, item) {
        if (err) {
          res.json(500, err);
          return;
        }
        var feedAct = req.body.feedAction || "updated";
        var feedSum = req.body.feedSummary || "updated a tag";
        var feedDispName = req.body.targetDisplayName || item.name;
        Feed.create({
          user: req.body.uid,
          action: feedAct,
          target: item.id,
          targetType: "Tag",
          targetDisplayName: feedDispName,
          summary: feedSum
        }, function(err, feedItem) {
          if (err) {
            res.json(500, err);
            return;
          }
          res.json(200, {_id: item.id});
        });
      });
    });
  }

};
