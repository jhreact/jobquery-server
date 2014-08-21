'use strict';

var User = require('../user/user_model.js');
var Feed = require('../feed/feed_model.js');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');

var WRONG_EMAIL_OR_PASSWORD = 'Wrong email or password';

module.exports = exports = {
  post: function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({email : email}, null,{select : 'password name isRegistered isAdmin'} ,function(err, user){
      var token;
      // user not found
      if(!user){
        res.send(401, WRONG_EMAIL_OR_PASSWORD);
      } else {
        bcrypt.compare(password, user.password, function(err, match) {
          // correct password
          if (match) {
            var profile = {
              name  : user.name,
              email : email,
              id    : user._id
            };
            if(user.isAdmin){
              token = jwt.sign(profile, process.env.ADMIN_SECRET || 'admin', { expiresInMinutes: 360 } );
            } else {
              token = jwt.sign(profile, process.env.USER_SECRET || 'user', { expiresInMinutes: 360 } );
            }
            // user logins once, he is then registered
            if (user.isRegistered === false) {
              user.isRegistered = true;
              user.save();
              Feed.create({
                user: user._id,
                action: "registered",
                targetDisplayName: user.name,
                summary: "logged in for the first time"
              }, function(err, feedItem) {
                if (err) {
                  res.json(500, err);
                  return;
                }
              });
            }
            res.json({token : token, _id : user._id, isAdmin : user.isAdmin});
          } else {
            // wrong password
            res.send(401, WRONG_EMAIL_OR_PASSWORD);
          }
        });
      }
    });
  }
};
