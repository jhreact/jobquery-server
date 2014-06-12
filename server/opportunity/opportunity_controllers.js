"use strict";

var Opportunity = require('./opportunity_model.js');

module.exports = exports = {

  getById: function (req, res, next) {
    Opportunity.findById(req.body.id, function (err, opp) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.json(200, opp);
    });
  },

  putById: function (req, res, next) {
    Opportunity.findById(req.body.id, function (err, opp) {
      if (err) {
        res.send(500, err);
        return;
      }
      for (var field in Opportunity.schema.paths) {
        if ( (field !== '_id') && (field !== '__v') ) {
          if (req.body[field] !== undefined) {
            opp[field] = req.body[field];
          }
        }
      }
      opp.save(function (err, item) {
        if (err) {
          res.send(500, err);
          return;
        }
        res.json(200, item.id);
      });
    });
  },

  get: function (req, res, next) {
    Opportunity.find(function (err, opps) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.json(200, opps);
    });
  },

  post: function (req, res, next) {
    Opportunity.create(req.body.opportunity, function (err, opp) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.send(201, opp.id);
    });
  }

};
