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

    Feed.find({updatedAt: {$gte: start}})
    // Feed.find()
    .populate({path: 'user', select: 'name email category searchStage', model: 'User'})
    .sort('-updatedAt user targetType')
    .exec()
    .then(function(data) {
      // console.log("GOT TO THEN CALL");
      // console.log(data);
      var isInDates = function(dateArr, dateStr) {
        for (var j=0; j < dateArr.length; j++) {
          if (dateArr[j][0] === dateStr) {
            return true;
          }
        }
        return false;
      };

      var activity = {};
      var results = [];
      var day, yyyy, mm, dd;
      var dates = [];
      var feedActor;
      var feedActors = [];
      var feedAction;
      var feedTarget;
      var feedEvent;
      for (var i=0; i < data.length; i++) {
        yyyy = '' + data[i].updatedAt.getFullYear();
        mm = '' + (data[i].updatedAt.getMonth() + 1 <= 9 ? '0' + (data[i].updatedAt.getMonth() + 1) : data[i].updatedAt.getMonth() + 1);
        dd = '' + (data[i].updatedAt.getDate() <= 9 ? '0' + data[i].updatedAt.getDate() : data[i].updatedAt.getDate() );
        day = yyyy + mm + dd;
        if (!isInDates(dates, day)) {
          dates.push([day, data[i].updatedAt.toDateString()]);
        }
        feedActor = data[i].user.name || data[i].user.email;
        if (feedActors.indexOf(feedActor) === -1) {
          feedActors.push(feedActor);
        }
        feedAction = data[i].summary;
        feedTarget = data[i].targetDisplayName;
        activity[day] = activity[day] || {};
        activity[day][feedActor] = activity[day][feedActor] || {};
        activity[day][feedActor][feedAction] = activity[day][feedActor][feedAction] || {};
        // activity[day][feedActor][feedAction][feedTarget] = activity[day][feedActor][feedAction][feedTarget] || [];
        feedEvent = {
          userid: data[i].user._id,
          userDisplayName: feedActor,
          target: data[i].target,
          targetType: data[i].targetType,
          targetDisplayName: data[i].targetDisplayName,
          actionObject: data[i].actionObject || undefined,
          actionObjectType: data[i].actionObjectType || undefined,
          actionObjectDisplayName: data[i].actionObjectDisplayName || undefined
        }
        activity[day][feedActor][feedAction][feedTarget] = feedEvent;
      }
      dates = dates.sort().reverse();
      for (var i=0; i < dates.length; i++) {
        results.push({
          date: dates[i][1],
          dateid: dates[i][0],
          isCollapsed: false,
          items : activity[dates[i][0]]
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
