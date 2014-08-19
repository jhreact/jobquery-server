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
        var feedAct = "updated";
        var feedActObj;
        var feedActObjType;
        if (req.body.feedAction) {
          feedAct = req.body.feedAction;
        }
        if (req.body.feedActionObject) {
          feedActObj = req.body.feedActionObject;
        }
        if (req.body.feedActionObjectType) {
          feedActObjType = req.body.feedActionObjectType;
        }
        Feed.create({user: req.body.uid, action: feedAct, actionObject: feedActObj, feedActionObjectType: feedActObjType, target: item.id, targetType: "Category"}, function(err, feeditem) {
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
      Feed.create({user: req.body.uid, action: "created", target: category.id, targetType: "Category"}, function(err, feeditem) {
        if (err) {
          res.json(500, err);
          return;
        }
        res.json(201, {_id: category.id});
      });
    });
  }

};
