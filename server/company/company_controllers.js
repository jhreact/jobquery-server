"use strict";

var Company = require('./company_model.js');

module.exports = exports = {

  getById: function (req, res, next) {
    Company.findById(req.body.id, function (err, company) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.json(200, company);
    });
  },

  putById: function (req, res, next) {
    Company.findById(req.body.id, function (err, company) {
      if (err) {
        res.send(500, err);
        return;
      }
      for (var field in Company.schema.paths) {
        if ( (field !== '_id') && (field !== '__v') ) {
          if (req.body[field] !== undefined) {
            company[field] = req.body[field];
          }
        }
      }
      company.save(function (err, item) {
        if (err) {
          res.send(500, err);
          return;
        }
        res.json(200, item.id);
      });
    });
  },

  get: function (req, res, next) {
    Company.find(function (err, companies) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.json(200, companies);
    });
  },

  post: function (req, res, next) {
    Company.create(req.body.company, function (err, company) {
      if (err) {
        res.send(500, err);
        return;
      }
      res.send(201, company.id);
    });
  }

};
