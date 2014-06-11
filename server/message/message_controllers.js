"use strict";

var Message = require('./message_model.js');

module.exports = exports = {
  post: function (req, res, next) {
    var message = req.body.text;
    var senderId = req.body.from;
    var receiverName = req.body.to;

    User.findOne({name: receiverName})
      .exec(function (err, receiver) {
        new Message({
          from: senderId, 
          to: receiver._id,
          text: message
        })
        .save(function (err, message) {
          if (err) { 
            res.send(501, err); 
          } else {
            res.send(201, message._id);
          }
        });
      });
  }
};
