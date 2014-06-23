var Match = require('../../match/match_model.js');
var Tag = require('../../tag/tag_model.js');
var Category = require('../../category/category_model.js');
var Opportunity = require('../../opportunity/opportunity_model.js');
var User = require('../../user/user_model.js');
var Company = require('../../company/company_model.js');
var Q = require('q');
var mongoose = require('mongoose');

module.exports = exports = {
  getByUserId: function (req, res) {
    var user;
    var matches;

    Q.all([
      Match
      .find({user: req.user.id})
      .select('-createdAt -updatedAt')
      .populate([
        {path: 'opportunity', select: '-createdAt -updatedAt'}
      ])
      .exec()
      .then(function (data) {
        return Tag.populate(data,
          {path: 'opportunity.tags.tag', select: '-createdAt -updatedAt'}
        )
        .then(function (matchesWithTags) {
          console.log('matchesWithTags:', matchesWithTags);
          return Company.populate(matchesWithTags,
            {path: 'opportunity.company'});
        })
        .then(function (matchesWithTagsCompany) {
          console.log('matchesWithTagsCompany:', matchesWithTagsCompany);
          return Category.populate(matchesWithTagsCompany,
            {path: 'opportunity.category'});
        })
        .then(function (results) {
          console.log('results:', results);
          // hide non-public tags from users
          for (var i = 0; i < results.length; i += 1) {
            for (var j = 0; j < results[i].opportunity.tags.length; j += 1) {
              if (results[i].opportunity.tags[j].tag.isPublic === false) {
                results[i].opportunity.tags[j].splice(j, 1);
                j -= 1;
              }
            }
          }
          matches = results;
          return;
        });
      }),

      User
      .findById(req.user.id)
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
          // hide non-public tags from users
          for (var i = 0; i < usr.tags.length; i += 1) {
            if (usr.tags[i].tag.isPublic === false) {
              usr.tags.splice(i, 1);
              i -= 1;
            }
          }
          user = usr;
          return;
        });
      })
    ])
    .then(function () {
      res.json(200, {user: user, matches: matches});
    });
  },

  putByIds: function (req, res) {
    Match.findOne({
      opportunity: req.params.id,
      user: req.user.id
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
  }
};
