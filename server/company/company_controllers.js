"use strict";

var Company = require('./company_model.js');

module.exports = exports = {

  getById: function (req, res) {
    Company.findById(req.params.id)
    .populate('opportunities')
    .exec(function (err, company) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.send(200, company);
    });
  },

  putById: function (req, res) {
    Company.findById(req.params.id, function (err, company) {
      if (err) {
        res.send(500, err);
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
          res.send(500, err);
          return;
        }
        res.send(200, item.id);
      });
    });
  },

  get: function (req, res) {
    Company.find()
    .populate('opportunities')
    .exec(function (err, companies) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.send(200, companies);
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
      country:            req.body.country
    }, function (err, company) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.send(201, company.id);
    });
  }

};
