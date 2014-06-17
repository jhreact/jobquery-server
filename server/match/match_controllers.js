var Match = require('./match_model.js');
var Tag = require('../tag/tag_model.js');

module.exports = exports = {

  getByUserId: function (req, res) {
    Match.find({userId: req.params.id})
    .populate([
      {path: 'userId'},
      {path: 'oppId'}
    ])
    .exec(function (err, matches) {
      if (err) {
        res.json(500, err);
        return;
      }
      Tag.populate(
        matches,
        {path: 'oppId.tags.tagId userId.tags.tagId'},
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
      {path: 'userId'},
      {path: 'oppId'}
    ])
    .exec(function (err, matches) {
      if (err) {
        res.json(500, err);
        return;
      }
      Tag.populate(
        matches,
        {path: 'oppId.tags.tagId userId.tags.tagId'},
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
      userId: req.params.userId
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
      userId: req.params.userId
    })
    .populate([
      {path: 'userId'},
      {path: 'oppId'}
    ])
    .exec(function (err, matches) {
      if (err) {
        res.json(500, err);
        return;
      }
      Tag.populate(
        matches,
        {path: 'oppId.tags.tagId userId.tags.tagId'},
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
      {path: 'userId'},
      {path: 'oppId'}
    ])
    .exec(function (err, matches) {
      if (err) {
        res.json(500, err);
        return;
      }
      Tag.populate(
        matches,
        {path: 'oppId.tags.tagId userId.tags.tagId'},
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
