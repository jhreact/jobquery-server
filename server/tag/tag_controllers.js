"use strict";

var Tag = require('./tag_model.js');
var UNABLE_TO_SAVE = "Server unable to save tag.";
var UNABLE_TO_READ = "Server unable to read tag.";

module.exports = exports = {
  post: function (req, res) {
    Tag.create({
      name: req.body.name,
      label: req.body.label,
      scaleDescription: req.body.scaleDescription || []
    }, function (err, tag) {
      if (err) { res.send(500, UNABLE_TO_SAVE); }
      res.send(201, tag._id);
    });
  },
  get: function (req, res) {
    Tag.find().exec(function(err, tags) {
      if (err) { res.send(500, UNABLE_TO_READ); }
      res.send(200, tags);
    });
  },

  getById: function (req, res) {
    TODO: update
    res.send(200);
  },

  putById: function (req, res) {
    TODO: update
    res.send(200);
  }

};
