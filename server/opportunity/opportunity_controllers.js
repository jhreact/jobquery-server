"use strict";

var Opportunity = require('./opportunity_model.js');

module.exports = exports = {

  getById: function (req, res) {
    Opportunity.findById(req.params.id)
    .populate([
      {path: 'company'},
      {path: 'tags.tagId'},
      {path: 'survey.userId', select: '_id name'}
    ])
    .exec(function (err, opp) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(200, opp);
    });
  },

  putById: function (req, res) {
    Opportunity.findById(req.params.id, function (err, opp) {
      if (err) {
        res.json(500, err);
        return;
      }

      Opportunity.schema.eachPath(function (field) {
        if ( (field !== '_id') && (field !== '__v') ) {
          if (req.body[field] !== undefined) {
            opp[field] = req.body[field];
          }
        }
      });

      opp.save(function (err, item) {
        if (err) {
          res.json(500, err);
          return;
        }
        res.json(201, item.id);
      });
    });
  },

  get: function (req, res) {
    Opportunity.find()
    .populate([
      {path: 'company'},
      {path: 'tags.tagId'},
      {path: 'survey.userId', select: '_id name'}
    ])
    .exec(function (err, opps) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(200, opps);
    });
  },

  post: function (req, res) {
    Opportunity.create(req.body, function (err, opp) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(201, opp.id);
    });
  }

};
