"use strict";

var Tag = require('./tag_model.js');

module.exports = exports = {
  post: function (req, res) {
    res.send(200); // return nothing for now
  },
  get: function (req, res) {
    Tag.find({})
      .exec(function(err, tags) {
        if (err) { res.send(500, "Server unable to read tags from database."); }
        res.send(tags);
      });
  }
};
