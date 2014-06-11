"use strict";

var Company = require('./company_model.js');

module.exports = exports = {

  get: function (req, res, next) {
    Company.find(function (err, companies) {
      if (err) {
        res.send(500, err);
      }
      res.json(200, companies);
    });
  },

  post: function (req, res, next) {
    Company.create(req.body.company, function (err, company) {
      if (err) {
        res.send(500, err);
      }
      res.send(201, company.id);
    });
  }

};
