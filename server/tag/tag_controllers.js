"use strict";

var Tag = require('./tag_model.js');
var UNABLE_TO_SAVE      = "Server unable to save tag.";
var UNABLE_TO_RETRIEVE  = "Server unable to retrieve tag.";

module.exports = exports = {

  post: function (req, res) {
    Tag.create({
      name:             req.body.name,
      label:            req.body.label,
      scaleDescription: req.body.scaleDescription || [],
      isPublic:         req.body.isPublic,
      category:         req.body.category
    }, function (err, tag) {
      if (err) {
        res.send(500, UNABLE_TO_SAVE);
        return;
      }
      res.send(201, tag.id);
    });
  },

  get: function (req, res) {
    Tag.find(function(err, tags) {
      if (err) {
        res.send(500, UNABLE_TO_RETRIEVE);
        return;
      }
      res.send(200, tags);
    });
  },

  getById: function (req, res) {
    Tag.findById(req.params.id, function (err, tag) {
      if (err) {
        res.send(500, UNABLE_TO_RETRIEVE);
        return;
      }
      res.send(200, tag);
    });
  },

  putById: function (req, res) {
    Tag.findById(req.params.id, function (err, tag) {
      if (err) {
        res.send(500, UNABLE_TO_RETRIEVE);
        return;
      }

      Tag.schema.eachPath(function (field) {
        if ( (field !== '_id') && (field !== '__v') ) {
          if (req.body[field] !== undefined) {
            tag[field] = req.body[field];
          }
        }
      });

      tag.save(function (err, item) {
        if (err) {
          res.send(500, err);
          return;
        }
        res.send(200, item.id);
      });
    });
  }

};
