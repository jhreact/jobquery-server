"use strict";

var Feed = require('./feed_model.js');

module.exports = exports = {

  get: function (req, res) {
    feed.find()
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
