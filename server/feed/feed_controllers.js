"use strict";

var Feed = require('./feed_model.js');

module.exports = exports = {

  getAll: function (req, res) {
    var data = {};
    var queryParams = {};
    var today = new Date();
    var twoWeeksAgo = new Date(today - 14 * 86400000);
    var start = req.query.fromDate || twoWeeksAgo;

    queryParams.createdAt = {$gte: start};

    Feed.find(queryParams)
    .sort('-updatedAt user targetType')
    .exec(function (err, feedItems) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(200, feedItems);
    });
  },

  post: function (req, res) {
    Feed.create(req.body, function (err, newFeedItem) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(201, {_id: newFeedItem.id});
    });
  },

  get: function(req, res) {
    Feed.find()
    .populate('user')
    .exec(function(err, feedItems) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(200, feedItems);
    });
  }

};
