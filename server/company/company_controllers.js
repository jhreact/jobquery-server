"use strict";

var Company = require('./company_model.js');

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
            company[field] = req.body[field];
          }
        }
      });

      company.save(function (err, item) {
        if (err) {
          res.json(500, err);
          return;
        }
        res.json(201, item.id);
      });
    });
  },

  get: function (req, res) {
    Company.find()
    .populate('opportunities')
    .exec(function (err, companies) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(200, companies);
    });
  },

  post: function (req, res) {
    Company.create({
      name:               req.body.name,
      briefDescription:   req.body.briefDescription,
      longDescription:    req.body.longDescription,
      address:            req.body.address,
      city:               req.body.city,
      state:              req.body.state,
      country:            req.body.country,
      media:              req.body.media,
      links:              req.body.links
    }, function (err, company) {
      if (err) {
        res.json(500, err);
        return;
      }
      res.json(201, company.id);
    });
  }

};
