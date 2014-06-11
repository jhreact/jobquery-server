"use strict";

var Message = require('./message_model.js');

module.exports = exports = {
  post: function (req, res, next) {
    var message = req.body.text;
    var senderId = req.body.from;

    User.findOne({name: req.body.to})
      .exec(function (err, receiver) {
        new Message({
          from: senderId, 
          to: receiver._id,
          text: req.body.text
        })
        .save(function (err, message) {
          if (err) { 
            res.send(501, err); 
          } else {
            res.send(200, message._id);
          }
        });
      });
  }
};