"use strict";

var Feed = require('./feed_model.js');

module.exports = exports = {

  get: function (req, res) {
    feed.find()
    // .where('active').equals(true)
    .exec(function (err, categories) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(200, categories);
    });
  },

  post: function (req, res) {
    feed.create(req.body, function (err, feed) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(201, {_id: feed.id});
    });
  }

};
