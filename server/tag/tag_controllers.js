"use strict";

var Tag = require('./tag_model.js');
var UNABLE_TO_SAVE      = "Server unable to save tag.";
var UNABLE_TO_RETRIEVE  = "Server unable to retrieve tag.";

module.exports = exports = {

  post: function (req, res) {
    Tag.create(req.body, function (err, tag) {
      if (err) {
        res.json(500, UNABLE_TO_SAVE);
        return;
      }
      res.json(201, {_id: tag.id});
    });
  },

  get: function (req, res) {
    Tag.find()
    .populate('category')
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
    .populate('category')
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
              if (req.body.category._id) {
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
        res.json(201, {_id: item.id});
      });
    });
  }

};
