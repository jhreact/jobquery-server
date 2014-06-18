'use strict';

var User = require('../user/user_model.js');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');

var WRONG_EMAIL_OR_PASSWORD = 'Wrong email or password';

module.exports = exports = {
  post: function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({email : email}, null,{select : 'password name'} ,function(err, user){
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
            var token = jwt.sign(profile, process.env.SECRET || 'secret', { expiresInMinutes: 360 } );
            res.json({token : token});
          } else {
            // wrong password
            res.send(401, WRONG_EMAIL_OR_PASSWORD);
          }
        });
      }
    });
  }
};
