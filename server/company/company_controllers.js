"use strict";

var Company = require('./company_model.js');
var Feed = require('../feed/feed_model.js');

module.exports = exports = {

  getById: function (req, res) {
    Company.findById(req.params.id)
    .populate('opportunities')
    .exec(function (err, company) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(200, company);
    });
  },

  putById: function (req, res) {
    Company.findById(req.params.id, function (err, company) {
      if (err) {
        res.json(500, err);
        return;
      }

      Company.schema.eachPath(function (field) {
        if ( (field !== '_id') && (field !== '__v') ) {
          if (req.body[field] !== undefined) {
            // depopulate opportunities
            if (field === 'opportunities') {
              if (req.body.opportunities) {
                for (var i = 0; i < req.body.opportunities.length; i += 1) {
                  if (req.body.opportunities[i]._id) {
                    req.body.opportunities[i] = req.body.opportunities[i]._id;
                  }
                }
              }
            }
            company[field] = req.body[field];
          }
        }
      });

      company.save(function (err, item) {
        if (err) {
          res.json(500, err);
          return;
        }
        Feed.create({user: req.body.uid, action: "updated a company", target: item.id, targetType: "Company"}, function(err, feeditem) {
          res.json(200, {_id: item.id});
        });
      });
    });
  },

  get: function (req, res) {
    Company.find()
    .exec(function (err, companies) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(200, companies);
    });
  },

  post: function (req, res) {
    Company.create(req.body, function (err, company) {
      if (err) {
        res.json(500, err);
        return;
      }
      Feed.create({user: req.body.uid, action: "created a new company", target: company.id, targetType: "Company"}, function(err, feeditem) {
        if (err) {
          res.json(500, err);
          return;
        }
        res.json(201, {_id: company.id});
      });
    });
  }

};
