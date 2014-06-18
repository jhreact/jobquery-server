var Match = require('./match_model.js');
var Tag = require('../tag/tag_model.js');

module.exports = exports = {

  getByUserId: function (req, res) {
    Match.find({user: req.params.id})
    .populate([
      {path: 'user'},
      {path: 'oppId'}
    ])
    .exec(function (err, matches) {
      if (err) {
        res.json(500, err);
        return;
      }
      Tag.populate(
        matches,
        {path: 'oppId.tags.tag user.tags.tag'},
        function (err, deepMatches) {
          if (err) {
            res.json(500, err);
            return;
          }
          res.json(200, deepMatches);
        });
    });
  },

  getByOppId: function (req, res) {
    Match.find({oppId: req.params.id})
    .populate([
      {path: 'user'},
      {path: 'oppId'}
    ])
    .exec(function (err, matches) {
      if (err) {
        res.json(500, err);
        return;
      }
      Tag.populate(
        matches,
        {path: 'oppId.tags.tag user.tags.tag'},
        function (err, deepMatches) {
          if (err) {
            res.json(500, err);
            return;
          }
          res.json(200, deepMatches);
        });
    });
  },

  putByIds: function (req, res) {
    Match.findOne({
      oppId: req.params.oppId,
      user: req.params.user
    }, function (err, match) {
      if (err) {
        res.json(500, err);
        return;
      }

      Match.schema.eachPath(function (field) {
        if ( (field !== '_id') && (field !== '__v') ) {
          if (req.body[field] !== undefined) {
            match[field] = req.body[field];
          }
        }
      });

      match.save(function (err, item) {
        if (err) {
          res.json(500, err);
          return;
        }
        res.json(201, item.id);
      });
    });
  },

  getByIds: function (req, res) {
    Match.findOne({
      oppId: req.params.oppId,
      user: req.params.user
    })
    .populate([
      {path: 'user'},
      {path: 'oppId'}
    ])
    .exec(function (err, matches) {
      if (err) {
        res.json(500, err);
        return;
      }
      Tag.populate(
        matches,
        {path: 'oppId.tags.tag user.tags.tag'},
        function (err, deepMatches) {
          if (err) {
            res.json(500, err);
            return;
          }
          res.json(200, deepMatches);
        });
    });
  },

  get: function (req, res) {
    Match.find()
    .populate([
      {path: 'user'},
      {path: 'oppId'}
    ])
    .exec(function (err, matches) {
      if (err) {
        res.json(500, err);
        return;
      }
      Tag.populate(
        matches,
        {path: 'oppId.tags.tag user.tags.tag'},
        function (err, deepMatches) {
          if (err) {
            res.json(500, err);
            return;
          }
          res.json(200, deepMatches);
        });
    });
  }

};
