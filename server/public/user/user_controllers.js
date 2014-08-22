"use strict";

var User = require('../../user/user_model.js');
var Feed = require('../../feed/feed_model.js');
var Category = require('../../category/category_model.js');
var bcrypt = require('bcrypt-nodejs');

module.exports = exports = {

  getById: function (req, res) {
    User.findById(req.user.id)
    .where('isAdmin').equals(false)
    .populate([
      {path: 'category', select: '-createdAt -updatedAt'},
      {path: 'tags.tag', select: '-createdAt -updatedAt'}
    ])
    .select('-isAdmin -internalNotes -password -resetHash')
    .exec()
    .then(function (data) {
      Category.populate(data,
        {path: 'tags.tag.category', select: '-createdAt -updatedAt'},
        function (err, dataWithCategory) {
          if (err) {
            res.json(500, err);
            return;
          }
          // hide non-public and inactive tags from users
          if (dataWithCategory) {
            for (var i = 0; i < dataWithCategory.tags.length; i += 1) {
              if (dataWithCategory.tags[i].tag.isPublic === false ||
                dataWithCategory.tags[i].tag.active === false) {
                dataWithCategory.tags.splice(i, 1);
                i -= 1;
              }
            }
          }
          res.json(200, dataWithCategory);
        }
      );
    });
  },

  putById: function (req, res) {

    if(req.body.oldPassword){
      exports.updatePassword(req, res);
    } else {
      User
      .findById(req.user.id)
      .populate('tags.tag')
      .exec(function (err, user) {
        if (err) {
          res.json(500, err);
          return;
        }

        // add privateTags that were not sent to user to tags array
        user.tags.forEach(function (tag) {
          if (!tag.tag.isPublic) {
            req.body.tags.push(tag);
          }
        });

        User.schema.eachPath(function (field) {
          if ( (field !== '_id') && (field !== '__v') && (field !== 'isAdmin')) {
            if (req.body[field] !== undefined) {
              // depopulate tags
              if (field === 'tags') {
                if (req.body.tags) {
                  for (var i = 0; i < req.body.tags.length; i += 1) {
                    if (req.body.tags[i].tag._id) {
                      req.body.tags[i].tag = req.body.tags[i].tag._id;
                    }
                  }
                }
              }
              // depopulate category
              if (field === 'category') {
                if (req.body.category && req.body.category._id) {
                  req.body.category = req.body.category._id;
                }
              }
              user[field] = req.body[field];
            }
          }
        });
        var updatedSearchStage = false;
        if (user.searchStage !== 'Early' && user.searchStage !== req.user.searchStage) {
          updatedSearchStage = true;
        }
        user.save(function (err, item) {
          if (err) {
            res.json(500, err);
            return;
          }
          if (updatedSearchStage) {
            var feedAct = req.body.feedAction || "updatedSearchStage";
            var feedSum = req.body.feedSummary || "updated search stage";
            var feedDispName = item.searchStage;
            Feed.create({
              user: item.id,
              action: feedAct,
              target: item.id,
              targetType: "User",
              targetDisplayName: feedDispName,
              summary: feedSum
            }, function(err, feedItem) {
              if (err) {
                res.json(500, err);
                return;
              }
            });
          }
          res.json(200, {_id: item.id});
        });
      });
    }

  },

  updatePassword: function(req, res){
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var newPasswordConfirm = req.body.newPasswordConfirm;
    var id = req.body._id;

    if(newPassword !== newPasswordConfirm){
      res.send(400);
    } else {
      User.findOne({_id: id}, null, {select: 'password'}, function(err, user){
        if(err){
          res.send(500);
        } else if (!user) {
          res.send(404);
        } else {
          bcrypt.compare(oldPassword, user.password, function(err, match){
            if(!match){
              res.send(401);
            } else {
              bcrypt.hash(newPassword, null, null, function(err, hash){
                user.password = hash;
                user.save(function(err){
                  err ? res.send(500) : res.send({_id: user._id});
                });
              });
            }
          });
        }
      });
    }

  }

};
