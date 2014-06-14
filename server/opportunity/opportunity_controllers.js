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
        res.send(500, err);
        return;
      }
      res.send(200, opp);
    });
  },

  putById: function (req, res) {
    Opportunity.findById(req.params.id, function (err, opp) {
      if (err) {
        res.send(500, err);
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
          res.send(500, err);
          return;
        }
        res.send(200, item.id);
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
        res.send(500, err);
        return;
      }
      res.send(200, opps);
    });
  },

  post: function (req, res) {
    Opportunity.create({
      active:         req.body.active,
      company:        req.body.company,
      jobTitle:       req.body.jobTitle,
      description:    req.body.description,
      tags:           req.body.tags,
      links:          req.body.links,
      notes:          req.body.notes,
      internalNotes:  req.body.internalNotes,
      questions:      req.body.questions
    }, function (err, opp) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.send(201, opp.id);
    });
  }

};
