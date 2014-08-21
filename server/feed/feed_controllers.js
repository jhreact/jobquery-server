"use strict";

var Feed = require('./feed_model.js');

module.exports = exports = {

  get: function (req, res) {
    var data = {};
    var queryParams = {};

    if (req.query.fromDate) {
      queryParams.createdAt = {$gte: req.query.fromDate};
    }

    feed.find(queryParams)
    .exec(function (err, feedItems) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(200, feedItems);
    });
  },

  getRecentItems: function (req, res) {
    var today = new Date();
    var twoWeeksAgo = new Date(today - 14 * 86400000);
    feed.find(
      {createdAt : {$gte : twoWeeksAgo}}
    )
    .select('-createdAt -updatedAt')
    .exec(function (err, feedItems) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(200, feedItems);
    });
  },

  post: function (req, res) {
    feed.create(req.body, function (err, newFeedItem) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(201, {_id: newFeedItem.id});
    });
  }

};
