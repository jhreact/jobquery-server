var map = require('map-stream');
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
      .select('-createdAt -updatedAt -opportunity')
      .populate([
        {path: 'user', select: 'name email tags category searchStage'}
      ])
      .exec()
      .then(function (data) {
        return Tag.populate(data,
          {path: 'user.tags.tag', select: '-createdAt -updatedAt'}
        )
        .then(function (matchesWithTags) {
          return Category.populate(matchesWithTags,
            {path: 'user.category', select: 'name'}
          )
          .then(function (finalData) {
            matches = finalData;
            return;
          });
        });
      }),

      Opportunity
      .findOne({_id: req.params.id})
      .select('-createdAt -updatedAt')
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
      .select('-createdAt -answers')
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
  },

  put: function(req, res){
    var id = req.body._id;
    var isProcessed = req.body.isProcessed;
    var internalNotes = req.body.internalNotes;
    console.log(req.body);
    Match.findOne({_id: id}, function(err, match){
      if(err){
        res.send(500);
      } else if (!match) {
        res.send(404);
      } else {
        match.update({isProcessed: isProcessed === undefined ? match.isProcessed : isProcessed, internalNotes: internalNotes}, function(err){
          err ? res.send(500) : res.send({_id: id});
        });
      }
    });

  },

  download: function (req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment');

    var userData = {};
    var userOrder = [];
    var oppOrder = [];
    var oppData = {};
    var newData = {};

    Q.all([
      User
      .find()
      .where('isAdmin').equals(false)
      .select('name email')
      .lean()
      .exec(function (err, users) {
        res.write('User Interest\n');
        users.forEach(function (user) {
          if (user.name) {
            userData[user._id] = user.name;
          } else {
            userData[user._id] = user.email;
            user.name = user.email;
          }
          userOrder.push(user._id);
          res.write(',' + JSON.stringify(user.name).replace(/\,/g, ' '));
        });
        res.write('\n');
      }),

      Opportunity
      .find()
      .select('jobTitle company')
      .populate({path: 'company', select: 'name'})
      .lean()
      .exec(function (err, opps) {
        opps.forEach(function (opp) {
          oppOrder.push(opp._id);
          oppData[opp._id] = [opp.jobTitle, opp.company.name];
        });
      })

    ])
    .then(function () {
      Match
      .find()
      .select('user opportunity userInterest adminOverride')
      .lean()
      .exec(function (err, data) {
        data.forEach(function (item) {
          newData[item.opportunity] = newData[item.opportunity] || {};
          newData[item.opportunity][item.user] = [item.userInterest, item.adminOverride];
        });
        oppOrder.forEach(function (oppId) {
          res.write(
            JSON.stringify(oppData[oppId][0]).replace(/\,/g, ' ') + ' (' +
            JSON.stringify(oppData[oppId][1]).replace(/\,/g, ' ') + ')'
          );
          userOrder.forEach(function (userId) {
            res.write(',' + newData[oppId][userId][0]);
          });
          res.write('\n');
        });
      })
      // provide adminOverride information on the same download
      .then(function () {
        res.write('\n\n\nAdmin Override\n');
        // write user header again
        userOrder.forEach(function (user) {
          res.write(',' + JSON.stringify(userData[user]).replace(/\,/g, ' '));
        });
        res.write('\n');
        // the write adminOverride
        oppOrder.forEach(function (oppId) {
          res.write(
            JSON.stringify(oppData[oppId][0]).replace(/\,/g, ' ') + ' (' +
            JSON.stringify(oppData[oppId][1]).replace(/\,/g, ' ') + ')'
          );
          userOrder.forEach(function (userId) {
            res.write(',' + newData[oppId][userId][1]);
          });
          res.write('\n');
        });
        // end response
        res.send();
      });
    });
  }
};
