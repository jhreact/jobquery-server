var Match = require('./match_model.js');
var Tag = require('../tag/tag_model.js');
var Category = require('../category/category_model.js');
var Opportunity = require('../opportunity/opportunity_model.js');
var User = require('../user/user_model.js');
var Company = require('../company/company_model.js');
var Q = require('q');
var mongoose = require('mongoose');

module.exports = exports = {

  getByUserId: function (req, res) {
    var user;
    var matches;

    Q.all([
      Match
      .find({user: req.params.id})
      .select('-createdAt -updatedAt')
      .populate([
        {path: 'opportunity', select: '-createdAt -updatedAt'}
      ])
      .exec()
      .then(function (data) {
        return Tag.populate(data,
          {path: 'opportunity.tags.tag', select: '-createdAt -updatedAt'}
        ).then(function (matchesWithTags) {
          matches = matchesWithTags;
          return;
        });
      }),

      User
      .findById(req.params.id)
      .select('-createdAt -updatedAt')
      .populate([
        {path: 'category', select: 'name'},
        {path: 'tags.tag', select: '-createdAt -updatedAt'},
      ])
      .exec()
      .then(function (data) {
        return Category.populate(data,
          {path: 'tags.tag.category', select: '-createdAt -updatedAt'}
        ).then(function (usr) {
          user = usr;
          return;
        });
      })
    ])
    .then(function () {
      res.json(200, {user: user, matches: matches});
    });
  },

  getByOppId: function (req, res) {
    var matches;
    var opportunity;

    Q.all([
      Match
      .find({opportunity: req.params.id})
      .select('-createdAt -updatedAt -answers -opportunity')
      .populate([
        {path: 'user', select: 'name email tags category'}
      ])
      .exec()
      .then(function (data) {
        return Tag.populate(data,
          {path: 'user.tags.tag', select: '-createdAt -updatedAt'}
        ).then(function (matchesWithTags) {
          matches = matchesWithTags;
          return;
        });
      }),

      Opportunity
      .findOne({_id: req.params.id})
      .select('-createdAt -updatedAt -answers')
      .populate([
        {path: 'company', select: 'name'},
        {path: 'category', select: 'name'},
        {path: 'tags.tag', select: '-createdAt -updatedAt'}
      ])
      .exec(function (err, opps) {
        opportunity = opps;
      })
    ])
    .then(function () {
      res.json(200, {matches: matches, opportunity: opportunity});
    });
  },

  putByIds: function (req, res) {
    Match.findOne({
      opportunity: req.params.opportunity,
      user: req.params.user
    }, function (err, match) {
      if (err) {
        res.json(500, err);
        return;
      }

      Match.schema.eachPath(function (field) {
        if ( (field !== '_id') && (field !== '__v') ) {
          if (req.body[field] !== undefined) {
            // depopulate user
            if (field === 'user') {
              if (req.body.user._id) {
                req.body.user = req.body.user._id;
              }
            }
            // depopulate opportunity
            if (field === 'opportunity') {
              if (req.body.opportunity._id) {
                req.body.opportunity = req.body.opportunity._id;
              }
            }
            match[field] = req.body[field];
          }
        }
      });

      match.save(function (err, item) {
        if (err) {
          res.json(500, err);
          return;
        }
        res.json(200, {_id: item.id});
      });
    });
  },

  get: function (req, res) {
    var data = {};

    Q.all([
      Match
      .find()
      .select('-createdAt -updatedAt -answers')
      .exec(function (err, matches) {
        data.matches = matches;
      }),

      Opportunity
      .find()
      .select('active approved category company jobTitle internalNotes')
      .populate([
        {path: 'company', select: 'name'},
        {path: 'category', select: 'name'}
      ])
      .exec(function (err, opportunities) {
        data.opportunities = opportunities;
      })
    ])
    .then(function () {
      res.json(200, data);
    });
  }
};
