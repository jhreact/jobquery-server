"use strict";
var User = require('../user/user_model.js');
var Match = require('../match/match_model.js');
var Feed = require('./feed_model.js');

module.exports = exports = {

  getAll: function (req, res) {
    var queryParams = {};
    var today = new Date();
    var twoWeeksAgo = new Date(today - 14 * 86400000);
    var start = req.query.fromDate || twoWeeksAgo;

    Feed.find({updatedAt: {$gte: start}, action : {$ne : 'processed'}})
    .populate({path: 'user', select: 'name email category searchStage', model: 'User'})
    .sort('-updatedAt user targetType')
    .exec()
    .then(function(data) {
      var getYYYYMMDDStr = function(myDate) {
        var yyyy;
        var mm;
        var dd;
        yyyy = '' + myDate.getFullYear();
        mm = '' + (myDate.getMonth() + 1 <= 9 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1);
        dd = '' + (myDate.getDate() <= 9 ? '0' + myDate.getDate() : myDate.getDate() );
        return yyyy + mm + dd;
      };
      var dateDisplay = function(yyyymmdd) {
        var y = yyyymmdd.substring(0,4) * 1;
        var m = yyyymmdd.substring(4,6) * 1;
        var d = yyyymmdd.substring(6,8) * 1;
        var newDate = new Date(y, -1 + m, d);
        return newDate.toDateString();
      };

      var activity = {};
      var results = [];
      var day;
      var dates;
      for (var i=0; i < data.length; i++) {
        day = getYYYYMMDDStr(data[i].updatedAt);
        var feedEvent = {
          userid: data[i].user._id,
          userDisplayName: data[i].user.name || data[i].user.email,
          target: data[i].target,
          targetType: data[i].targetType,
          targetDisplayName: data[i].targetDisplayName,
          actionObject: data[i].actionObject || undefined,
          actionObjectType: data[i].actionObjectType || undefined,
          actionObjectDisplayName: data[i].actionObjectDisplayName || undefined,
          summary: data[i].summary,
          updatedAt: data[i].updatedAt
        }

        activity[day] = activity[day] || [];
        activity[day].push(feedEvent);
      }
      dates = Object.keys(activity).sort().reverse();
      for (var i=0; i < dates.length; i++) {
        results.push({
          date: dateDisplay(dates[i]),
          dateid: dates[i],
          isCollapsed: false,
          items : activity[dates[i]]
        });
      }
      res.json(201, results);
    });
  },

  post: function (req, res) {
    var feedObj = req.body;
    if (req.body.targetType === 'Match' && req.body.target && !req.body.actionObject) {
      Match.findOne({
        _id: req.body.target
      }, function(err, match) {
        if (err) {
          res.json(500, err);
          return;
        }
        feedObj.actionObject = match.opportunity._id;
        Feed.create(req.body, function (err, newFeedItem) {
          if (err) {
            res.json(500, err);
            return;
          }
          res.json(201, {_id: newFeedItem.id});
        });
      });
    } else {
      Feed.create(req.body, function (err, newFeedItem) {
        if (err) {
          res.json(500, err);
          return;
        }
        res.json(201, {_id: newFeedItem.id});
      });
    }
  }

};
