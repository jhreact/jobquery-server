"use strict";

var User = require('../../user/user_model.js');
var Category = require('../../category/category_model.js');

module.exports = exports = {

  getById: function (req, res) {
    User.findById(req.user.id)
    .where('isAdmin').equals(false)
    .populate([
      {path: 'category', select: '-createdAt -updatedAt'},
      {path: 'tags.tag', select: '-createdAt -updatedAt'}
    ])
    .select('-isAdmin -internalNotes -password -passwordHash')
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
          for (var i = 0; i < dataWithCategory.tags.length; i += 1) {
            if (dataWithCategory.tags[i].tag.isPublic === false ||
              dataWithCategory.tags[i].tag.active === false) {
              dataWithCategory.tags.splice(i, 1);
              i -= 1;
            }
          }
          res.json(200, dataWithCategory);
        }
      );
    });
  },

  putById: function (req, res) {
    User.findById(req.user.id, function (err, user) {
      if (err) {
        res.json(500, err);
        return;
      }

      User.schema.eachPath(function (field) {
        if ( (field !== '_id') && (field !== '__v') ) {
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

      user.save(function (err, item) {
        if (err) {
          res.json(500, err);
          return;
        }
        res.json(200, {_id: item.id});
      });
    });
  }

};
