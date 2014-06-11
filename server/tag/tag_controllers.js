"use strict";

var Tag = require('./tag_model.js');

module.exports = exports = {
  post: function (req, res) {
    Tag.create({
      name: req.body.name,
      label: req.body.label,
      scaleDescription: req.body.scaleDescription || []
    }), function (err, tag) {
      if (err) { res.send(500, "Server unable to save tag."); }
      res.send(201, tag._id);
    });
  },
  get: function (req, res) {
    Tag.find({})
      .exec(function(err, tags) {
        if (err) { res.send(500, "Server unable to read tags from database."); }
        res.send(200, tags);
      });
  }
};