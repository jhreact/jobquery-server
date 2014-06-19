var Match = require('./match_model.js');
var Tag = require('../tag/tag_model.js');
var Category = require('../category/category_model.js');
var Company = require('../company/company_model.js');


var popAndConvert = function (res, matches) {
  Tag.populate(
    matches,
    {path: 'opportunity.tags.tag user.tags.tag'},
    function (err, matchesWithTags) {
      if (err) {
        res.json(500, err);
        return;
      }
      Company.populate(
        matchesWithTags,
        {path: 'opportunity.company'},
        function (err, matchesWithTagsAndCompany) {
          if (err) {
            res.json(500, err);
            return;
          }
          Category.populate(
            matchesWithTagsAndCompany,
            {path: 'opportunity.company.category user.category opportunity.tags.tag.category user.tags.tag.category'},
            function (err, populated) {
              if (err) {
                res.json(500, err);
                return;
              }
              // res.json(200, populated);

              var formatted = {};
              var user;
              var opp;
              for (var i = 0; i < populated.length; i += 1) {
                userId = populated[i].user._id;
                opp = {};
                // check to see if user exists
                if (!formatted.hasOwnProperty(userId)) {
                  // if user does not exist, create user portion
                  formatted[userId] = {
                    user:           populated[i].user,
                    opportunities:  []
                  };
                }
                // always, format opportunity portion, then push
                opp = populated[i].opportunity;
                opp.isProcessed     = populated[i].isProcessed;
                opp.userInterest    = populated[i].userInterest;
                opp.adminOverride   = populated[i].adminOverride;
                opp.answers         = populated[i].answers;
                formatted[userId].opportunities.push(opp);
              }
              res.send(200, formatted);
            }
          );
        }
      );
    }
  );
};

module.exports = exports = {

  getByUserId: function (req, res) {
    Match.find({user: req.params.id})
    .populate([
      {path: 'user'},
      {path: 'opportunity'}
    ])
    .exec(function (err, matches) {
      if (err) {
        res.json(500, err);
        return;
      }
      popAndConvert(res, matches);
    });
  },

  getByOppId: function (req, res) {
    Match.find({opportunity: req.params.id})
    .populate([
      {path: 'user'},
      {path: 'opportunity'}
    ])
    .exec(function (err, matches) {
      if (err) {
        res.json(500, err);
        return;
      }
      popAndConvert(res, matches);
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
        res.json(201, {_id: item.id});
      });
    });
  },

  getByIds: function (req, res) {
    Match.findOne({
      opportunity: req.params.opportunity,
      user: req.params.user
    })
    .populate([
      {path: 'user'},
      {path: 'opportunity'}
    ])
    .exec(function (err, matches) {
      if (err) {
        res.json(500, err);
        return;
      }
      popAndConvert(res, matches);
    });
  },

  get: function (req, res) {
    Match.find()
    .populate([
      {path: 'user'},
      {path: 'opportunity'}
    ])
    .exec(function (err, matches) {
      if (err) {
        res.json(500, err);
        return;
      }
      popAndConvert(res, matches);
    });
  }
};
