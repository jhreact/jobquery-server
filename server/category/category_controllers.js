"use strict";

var Category = require('./category_model.js');
var Feed = require('../feed/feed_model.js');

module.exports = exports = {

  getByType: function (req, res) {
    Category.find({type: req.params.type})
    .where('active').equals(true)
    .exec(function (err, category) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(200, category);
    });
  },

  putById: function (req, res) {
    Category.findById(req.params.id, function (err, category) {
      if (err) {
        res.json(500, err);
        return;
      }

      Category.schema.eachPath(function (field) {
        if ( (field !== '_id') && (field !== '__v') ) {
          if (req.body[field] !== undefined) {
            category[field] = req.body[field];
          }
        }
      });

      category.save(function (err, item) {
        if (err) {
          res.json(500, err);
          return;
        }
        var feedAct = req.body.feedAction || "updated";
        var feedSum = req.body.feedSummary || "updated a category";
        var feedDispName = req.body.targetDisplayName || item.name;
        // var feedActObj = req.body.feedActionObject || undefined;
        // var feedActObjType = req.body.feedActionObjectType || undefined;
        Feed.create({
          user: req.body.uid,
          action: feedAct,
          target: item.id,
          targetType: "Category",
          targetDisplayName: feedDispName,
          summary: feedSum
        }, function(err, feeditem) {
          if (err) {
            res.json(500, err);
            return;
          }
          res.json(200, {_id: item.id});
        });
      });
    });
  },

  get: function (req, res) {
    Category.find()
    .where('active').equals(true)
    .exec(function (err, categories) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(200, categories);
    });
  },

  post: function (req, res) {
    Category.create(req.body, function (err, category) {
      if (err) {
        res.json(500, err);
        return;
      }
      var feedAct = req.body.feedAction || "created";
      var feedSum = req.body.feedSummary || "created a category";
      var feedDispName = req.body.targetDisplayName || category.name;
      Feed.create({
        user: req.body.uid,
        action: feedAct,
        target: category.id,
        targetType: "Category",
        targetDisplayName: feedDispName,
        summary: feedSum
      }, function(err, feeditem) {
        if (err) {
          res.json(500, err);
          return;
        }
        res.json(201, {_id: category.id});
      });
    });
  }

};
