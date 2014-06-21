"use strict";

var Company = require('../../company/company_model.js');

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
  }
};
