"use strict";

var Tag = require('./tag_model.js');

module.exports = exports = {
  post: function (req, res, next) {
    var message = req.body.text;
    var senderId = req.body.from;
    var receiverName = req.body.to;

    User.findOne({name: receiverName})
      .exec(function (err, receiver) {
        if (!err) {
          new Tag({
            from: senderId, 
            to: receiver._id,
            text: message
          })
          .save(function (err, message) {
            if (err) { 
              res.send(500, "Error in saving message to database."); 
            } else {
              res.send(201, message._id);
            }
          });
        } else {
          res.send(404, "Receiver not found");
        }
      });
  }
};
